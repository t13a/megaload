import { StreamProcessorContext } from ".";

export const Pause = <I>(pauseSignal: PauseSignal) =>
  async function* ({ input, signal, ...context }: StreamProcessorContext<I>) {
    const logger = context.logger.create(Pause.name);
    logger.begin();

    for await (const value of input) {
      if (signal.aborted) {
        break;
      }

      if (pauseSignal.paused) {
        await pauseSignal.waitForResume();
      }

      yield value;
    }

    logger.end();
  };

export class PauseController {
  private resolves: (() => void)[] = [];
  private _paused = false;
  private _signal: PauseSignal;

  constructor() {
    const controller = this;
    this._signal = {
      get paused() {
        return controller._paused;
      },
      async waitForResume() {
        if (!controller._paused) {
          return;
        }
        await new Promise<void>((resolve) => {
          controller.resolves.push(resolve);
        });
      },
    };
  }

  get paused(): boolean {
    return this._paused;
  }

  get signal(): PauseSignal {
    return this._signal;
  }

  pause(): void {
    this._paused = true;
  }

  resume(): void {
    this._paused = false;
    this.resolves.forEach((resolve) => resolve());
    this.resolves.length = 0;
  }
}

export type PauseSignal = {
  readonly paused: boolean;
  readonly waitForResume: () => Promise<void>;
};
