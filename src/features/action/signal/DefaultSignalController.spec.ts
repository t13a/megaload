import { DefaultSignalController } from "./DefaultSignalController";

describe("DefaultSignalController", () => {
  it("has a signal", () => {
    const signalController = new DefaultSignalController();
    const signal = signalController.signal;
    expect(signal.canceled).toBe(false);
    expect(signal.paused).toBe(false);
  });

  it("tells the signal to cancel", () => {
    const signalController = new DefaultSignalController();
    const signal = signalController.signal;

    signalController.cancel();
    expect(signal.canceled).toBe(true);
  });

  it("tells the signal to pause/resume", () => {
    const signalController = new DefaultSignalController();
    const signal = signalController.signal;

    signalController.pause();
    expect(signal.paused).toBe(true);

    signalController.resume();
    expect(signal.paused).toBe(false);
  });

  describe("signal", () => {
    it("registers callbacks on cancel", () => {
      const signalController = new DefaultSignalController();
      const signal = signalController.signal;

      const result: any[] = [];
      signal.register("cancel", () => result.push(1));
      signal.register("cancel", () => result.push(2));
      signalController.cancel();
      expect(result).toStrictEqual([1, 2]);

      signalController.cancel(); // do nothing
      expect(result).toStrictEqual([1, 2]);
    });

    it("unregisters a callback on cancel", () => {
      const signalController = new DefaultSignalController();
      const signal = signalController.signal;

      const result: any[] = [];
      const unregister = signal.register("cancel", () => result.push(1));
      unregister();
      signalController.cancel();
      expect(result).toStrictEqual([]);
    });

    it("waits for resume if in pause", async () => {
      const signalController = new DefaultSignalController();
      const signal = signalController.signal;

      const beginAt = new Date().getTime();
      signalController.pause();
      setTimeout(() => signalController.resume(), 10);
      await signal.waitForResume();
      const endAt = new Date().getTime();
      expect(endAt - beginAt).toBeGreaterThanOrEqual(10);
    });

    it("do not wait for resume if not in pause", async () => {
      const signalController = new DefaultSignalController();
      const signal = signalController.signal;

      const beginAt = new Date().getTime();
      await signal.waitForResume();
      const endAt = new Date().getTime();
      expect(endAt - beginAt).toBeLessThan(1);
    });
  });
});
