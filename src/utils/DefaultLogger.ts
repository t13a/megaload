import { Logger, LoggerWriter } from "./Logger";

export type DefaultLoggerWriters = {
  readonly debug: LoggerWriter;
  readonly info: LoggerWriter;
  readonly warn: LoggerWriter;
  readonly error: LoggerWriter;
  readonly begin: LoggerWriter;
  readonly end: LoggerWriter;
};

export class DefaultLogger implements Logger {
  readonly id: string;
  readonly writers: DefaultLoggerWriters;
  private createCount: number = 0;
  private beginAt: number | undefined;

  constructor(id: string, writers: DefaultLoggerWriters) {
    this.id = id;
    this.writers = writers;
  }

  create(subId?: string | undefined): Logger {
    if (this.createCount == Number.MAX_SAFE_INTEGER) {
      this.createCount = 0;
    }
    this.createCount++;
    return new DefaultLogger(
      `${this.id}:${subId !== undefined ? subId : this.createCount}`,
      this.writers,
    );
  }

  private write(callback: LoggerWriter, data: any[]) {
    callback(`[${this.id}]`, ...data);
  }

  debug(...data: any[]): void {
    this.write(this.writers.debug, data);
  }

  info(...data: any[]): void {
    this.write(this.writers.info, data);
  }

  warn(...data: any[]): void {
    this.write(this.writers.warn, data);
  }

  error(...data: any[]): void {
    this.write(this.writers.error, data);
  }

  begin(): void {
    const now = new Date().getTime();
    this.beginAt = now;
    this.write(this.writers.begin, ["BEGIN"]);
  }

  end(): void {
    const now = new Date().getTime();
    this.write(this.writers.end, [
      `END (${this.beginAt ? now - this.beginAt : "?"} ms)`,
    ]);
    this.beginAt = undefined;
  }

  static of(id: string, writer: LoggerWriter) {
    return new DefaultLogger(id, {
      debug: writer,
      info: writer,
      warn: writer,
      error: writer,
      begin: writer,
      end: writer,
    });
  }
}
