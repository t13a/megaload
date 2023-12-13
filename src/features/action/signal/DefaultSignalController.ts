import { Signal, SignalController } from ".";

export class DefaultSignalController implements SignalController {
  readonly signal: Signal;

  private canceled = false;
  private paused = false;
  private onCancelCallbacks: Set<() => void> = new Set();
  private onResumeResolves: (() => void)[] = [];

  constructor() {
    const self = this;
    this.signal = {
      get canceled() {
        return self.canceled;
      },
      get paused() {
        return self.paused;
      },
      register(name, callback) {
        self.onCancelCallbacks.add(callback);
        return () => self.onCancelCallbacks.delete(callback);
      },
      async waitForResume() {
        if (!self.paused) {
          return;
        }
        await new Promise<void>((resolve) => {
          self.onResumeResolves.push(resolve);
        });
      },
    };
  }

  cancel(): void {
    this.canceled = true;
    this.onCancelCallbacks.forEach((callback) => callback());
    this.onCancelCallbacks.clear();
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
    this.onResumeResolves.forEach((resolve) => resolve());
    this.onResumeResolves.length = 0;
  }
}
