import { SubActionFactory } from "..";

export const Stub: SubActionFactory =
  () =>
  async ({ logger, signal, trigger }) => {
    const max = 10;
    trigger("progress", { type: "max", value: max });
    trigger("progress", { type: "now", value: 0 });
    for (let now = 1; now <= max; now++) {
      await signal.waitForResume();
      if (signal.canceled) {
        trigger("canceled", {});
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      logger.info(`Processing (${now}/${max})`);
      trigger("progress", { type: "now", value: now });
    }

    trigger("succeeded", {});
  };
