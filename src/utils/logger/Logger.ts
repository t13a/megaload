export interface Logger {
  readonly create: (name?: string) => Logger;

  readonly debug: LoggerWriter;
  readonly info: LoggerWriter;
  readonly warn: LoggerWriter;
  readonly error: LoggerWriter;

  readonly begin: () => void;
  readonly end: () => void;
}

export type LoggerWriter = (...data: any[]) => void;
