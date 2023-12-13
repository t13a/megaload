import { Action } from ".";
import { createUnblock } from "./createUnblock";
import { SingleHookCallbackRegistry } from "./hook";
import { DefaultLogger, Log } from "./logger";
import { DefaultSignalController } from "./signal";

type TestHooks = {};

type TestAction = Action<TestHooks>;

const doAction: TestAction = async ({ logger, signal }) => {
  logger.debug("begin");

  const unblock = createUnblock(10);

  const beginAt = new Date().getTime();
  while (new Date().getTime() < beginAt + 5000) {
    // Unblock every 10 ms.
    if (await unblock()) {
      await signal.waitForResume();
      if (signal.canceled) {
        logger.warn("canceled");
        return;
      }
    }
  }

  logger.info("end");
};

describe("createUnblock", () => {
  it("unblocks every interval", async () => {
    const logs: Log[] = [];
    const logger = new DefaultLogger((log) => logs.push(log));
    const signalController = new DefaultSignalController();
    const signal = signalController.signal;
    const registry = new SingleHookCallbackRegistry<TestHooks>();
    const trigger = registry.trigger;

    // Cancel after 5 ms.
    setTimeout(() => signalController.cancel(), 5);

    await doAction({ logger, signal, trigger });
    const beginAt = logs[0].timestamp.getTime();
    const endAt = logs[1].timestamp.getTime();
    expect(endAt - beginAt).toBeGreaterThanOrEqual(5);
    expect(endAt - beginAt).toBeLessThan(1000);
    expect(logs[1].data).toBe("canceled");
  });
});
