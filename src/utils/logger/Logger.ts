export interface Logger {
  readonly id: string;

  readonly create: (subId?: string) => Logger;

  readonly debug: LoggerWriter;
  readonly info: LoggerWriter;
  readonly warn: LoggerWriter;
  readonly error: LoggerWriter;

  readonly begin: () => void;
  readonly end: () => void;
}

export type LoggerWriter = (...data: any[]) => void;
