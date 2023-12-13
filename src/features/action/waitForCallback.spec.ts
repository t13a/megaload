import { Action, waitForCallback } from ".";
import { SingleHookCallbackRegistry } from "./hook";
import { DefaultLogger, Log } from "./logger";
import { DefaultSignalController } from "./signal";

type TestHooks = {
  // XXX
  // ready: { run: () => void };
  ready: { run: (value: void) => void };
  "require-text": { text: (value: string) => void };
};

type TestAction = Action<TestHooks>;

const waitForRun: TestAction = async ({ logger, ...context }) => {
  logger.debug("begin");

  // Wait for run.
  const result = await waitForCallback(context, "ready", (run) => {
    return { run };
  });
  switch (result.type) {
    case "canceled":
      logger.warn("canceled");
      return;
    case "rejected":
      logger.error(result.error);
      return;
  }

  logger.info("end");
};

const requireText: TestAction = async ({ logger, ...context }) => {
  logger.debug("begin");

  // Require a text.
  const result = await waitForCallback(context, "require-text", (callback) => {
    return { text: callback };
  });
  switch (result.type) {
    case "canceled":
      logger.warn("canceled");
      return;
    case "rejected":
      logger.error(result.error);
      return;
  }

  logger.info(result.value);
};

describe("waitForCallback", () => {
  it("waits for the callback in the payload to be invoked", async () => {
    const logs: Log[] = [];
    const logger = new DefaultLogger((log) => logs.push(log));
    const signalController = new DefaultSignalController();
    const signal = signalController.signal;
    const registry = new SingleHookCallbackRegistry<TestHooks>();
    const trigger = registry.trigger;

    // Run after 10 ms.
    registry.register("ready", ({ run }) => setTimeout(() => run(), 10));

    await waitForRun({ logger, signal, trigger });
    const beginAt = logs[0].timestamp.getTime();
    const endAt = logs[1].timestamp.getTime();
    expect(endAt - beginAt).toBeGreaterThan(10);
    expect(logs[1].data).toBe("end");
  });

  it("does not wait if the action is canceled", async () => {
    const logs: Log[] = [];
    const logger = new DefaultLogger((log) => logs.push(log));
    const signalController = new DefaultSignalController();
    const signal = signalController.signal;
    const registry = new SingleHookCallbackRegistry<TestHooks>();
    const trigger = registry.trigger;

    // Run after 10 ms.
    registry.register("ready", ({ run }) => setTimeout(() => run(), 10));

    // Cancel after 5 ms.
    setTimeout(() => signalController.cancel(), 5);

    await waitForRun({ logger, signal, trigger });
    const beginAt = logs[0].timestamp.getTime();
    const endAt = logs[1].timestamp.getTime();
    expect(endAt - beginAt).toBeGreaterThanOrEqual(5);
    expect(endAt - beginAt).toBeLessThan(10);
    expect(logs[1].data).toBe("canceled");
  });

  it("does not wait if an error occurs in callback", async () => {
    const logs: Log[] = [];
    const logger = new DefaultLogger((log) => logs.push(log));
    const signalController = new DefaultSignalController();
    const signal = signalController.signal;
    const registry = new SingleHookCallbackRegistry<TestHooks>();
    const trigger = registry.trigger;

    // Cause an error.
    registry.register("ready", () => {
      throw new Error();
    });

    await waitForRun({ logger, signal, trigger });
    expect(logs[1].data).toBeInstanceOf(Error);
  });

  it("gets value from the callback", async () => {
    const logs: Log[] = [];
    const logger = new DefaultLogger((log) => logs.push(log));
    const signalController = new DefaultSignalController();
    const signal = signalController.signal;
    const registry = new SingleHookCallbackRegistry<TestHooks>();
    const trigger = registry.trigger;

    // Pass a text.
    registry.register("require-text", ({ text }) => text("OK"));

    await requireText({ logger, signal, trigger });
    expect(logs[1].data).toBe("OK");
  });
});
