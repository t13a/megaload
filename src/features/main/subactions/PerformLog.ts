import { WaitForCallbackResult } from "@/features/action";
import { DefaultLogger, Writer } from "@/features/action/logger";
import {
  buffer,
  writeToConsole,
  writeToFile,
  writeToTerminal,
} from "@/features/action/logger/writers";
import { DependencyContainer } from "tsyringe";
import { Terminal } from "xterm";
import { SubAction, SubActionFactory } from "..";

export const PerformLog =
  (writerCallback: () => Promise<WaitForCallbackResult<Writer>>): SubAction =>
  async ({ logger, signal, trigger }) => {
    const result = await writerCallback();
    if (result.type === "canceled") {
      trigger("canceled", {});
      return;
    } else if (result.type === "rejected") {
      trigger("failed", { error: result.error });
      return;
    }
    const countLogger = new DefaultLogger(result.value);
    let count = 0;

    const duration = 10000; // 10 seconds
    const interval = 100; // 0.1 second
    const beginAt = new Date().getTime();
    let last = beginAt;

    trigger("progress", { type: "max", value: duration });
    trigger("progress", { type: "now", value: 0 });

    while (true) {
      const now = new Date().getTime();
      if (now >= beginAt + duration) {
        break;
      } else if (now >= last + interval) {
        last = now;
        await new Promise((resolve) => setTimeout(resolve));
        await signal.waitForResume();
        if (signal.canceled) {
          trigger("canceled", {});
          return;
        }

        trigger("progress", { type: "now", value: now - beginAt });
      }

      count++;
      countLogger.debug(`${count}`);
    }

    const endAt = new Date().getTime();
    logger.info();
    logger.info(`count = ${count}`);
    logger.info(`time = ${endAt - beginAt} ms`);
    logger.info(`iops = ${(count * 1000) / (endAt - beginAt)}`);
    logger.info();

    trigger("succeeded", {});
  };

export class PerformLogToConsole implements SubActionFactory {
  create() {
    return PerformLog(async () => {
      return {
        type: "resolved",
        value: writeToConsole(),
      };
    });
  }
}

export class PerformLogToTerminal implements SubActionFactory {
  create(childContainer: DependencyContainer) {
    const terminal = childContainer.resolve(Terminal);
    return PerformLog(async () => {
      return {
        type: "resolved",
        value: buffer(100, writeToTerminal(terminal)),
      };
    });
  }
}

export class PerformLogToFile implements SubActionFactory {
  create() {
    return PerformLog(async () => {
      let fileHandle: FileSystemFileHandle;
      try {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: "megaload.log",
        });
      } catch (error) {
        if (error instanceof DOMException) {
          if (error.name === "AbortError" || error.name === "SecurityError") {
            return { type: "canceled" };
          }
        }
        return { type: "rejected", error };
      }

      return {
        type: "resolved",
        value: buffer(100, writeToFile(fileHandle)),
      };
    });
  }
}
