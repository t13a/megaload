import { DefaultLogger, Logger } from "@/features/action/logger";
import {
  buffer,
  writeToConsole,
  writeToFile,
  writeToTerminal,
} from "@/features/action/logger/writers";
import { SubAction, SubActionFactory } from "..";

export const PerformLog =
  (loggerFactory: () => Logger | Promise<Logger>): SubAction =>
  async ({ logger, signal, trigger }) => {
    const targetLogger = await loggerFactory();
    const duration = 10000; // 10 seconds
    const interval = 100; // 0.1 second
    const beginAt = new Date().getTime();
    trigger("progress", { type: "max", value: duration });
    trigger("progress", { type: "now", value: 0 });

    let count = 0;
    let latest = new Date().getTime();
    while (true) {
      const now = new Date().getTime();
      if (now >= beginAt + duration) {
        break;
      } else if (now >= latest + interval) {
        latest = now;
        await new Promise((resolve) => setTimeout(resolve));
        await signal.waitForResume();
        if (signal.canceled) {
          trigger("canceled", {});
          return;
        }
        trigger("progress", { type: "now", value: now - beginAt });
      }

      count++;
      targetLogger.debug(`${count}`);
    }

    const endAt = new Date().getTime();
    logger.info();
    logger.info(`count = ${count}`);
    logger.info(`time = ${endAt - beginAt} ms`);
    logger.info(`iops = ${(count * 1000) / (endAt - beginAt)}`);
    logger.info();
    trigger("succeeded", {});
  };

export const PerformLogToConsole: SubActionFactory = () =>
  PerformLog(() => new DefaultLogger(writeToConsole()));

export const PerformLogToTerminal: SubActionFactory = ({ terminal }) =>
  PerformLog(() => new DefaultLogger(buffer(100, writeToTerminal(terminal))));

export const PerformLogToFile: SubActionFactory = async () => {
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: "test.log",
  });
  return PerformLog(
    () => new DefaultLogger(buffer(100, writeToFile(fileHandle))),
  );
};
