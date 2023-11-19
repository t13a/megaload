export interface Logger {
  readonly create: (name?: string) => Logger;

  readonly debug: Writer;
  readonly info: Writer;
  readonly warn: Writer;
  readonly error: Writer;

  readonly begin: () => void;
  readonly end: () => void;
}

export type Writer = (...data: any[]) => void;
