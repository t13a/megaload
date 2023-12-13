export type Signal = {
  readonly canceled: boolean;
  readonly paused: boolean;
  register(name: "cancel", callback: () => void): Unregister;
  waitForResume(): Promise<void>;
};

export type SignalController = {
  readonly signal: Signal;
  cancel(): void;
  pause(): void;
  resume(): void;
};

type Unregister = () => void;
