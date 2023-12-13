export type Logger = {
  get(name: string): Logger;

  debug(data?: any): void;
  info(data?: any): void;
  warn(data?: any): void;
  error(data?: any): void;
};

export type Log = {
  readonly timestamp: Date;
  readonly level: Level;
  readonly name?: string;
  readonly data?: any;
};

export type Level = "debug" | "info" | "warn" | "error";

export type Writer = (log: Log) => void;

export type BufferedWriter = (logs: readonly Log[]) => void;

export type LogOperator = (log: Log) => Log;

export type LogPredicate = (log: Log) => boolean;
