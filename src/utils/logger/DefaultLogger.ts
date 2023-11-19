import { Logger, Writer } from "./Logger";

export type DefaultLoggerWriters = {
  readonly debug: Writer;
  readonly info: Writer;
  readonly warn: Writer;
  readonly error: Writer;
  readonly begin: Writer;
  readonly end: Writer;
};

export class DefaultLogger implements Logger {
  private name: string | undefined;
  readonly writers: DefaultLoggerWriters;
  private createCount: number = 0;
  private beginAt: number | undefined;

  constructor(writers: DefaultLoggerWriters) {
    this.writers = writers;
  }

  create(name?: string): Logger {
    const newLogger = new DefaultLogger(this.writers);

    const prefix = this.name ? `${this.name}:` : "";
    if (name) {
      newLogger.name = `${prefix}${name}`;
    } else {
      if (this.createCount == Number.MAX_SAFE_INTEGER) {
        this.createCount = 0;
      }
      this.createCount++;
      newLogger.name = `${prefix}${this.createCount}`;
    }

    return newLogger;
  }

  private write(writer: Writer, data: any[]) {
    if (this.name) {
      writer(`[${this.name}]`, ...data);
    } else {
      writer(...data);
    }
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

  static of(writer: Writer) {
    return new DefaultLogger({
      debug: writer,
      info: writer,
      warn: writer,
      error: writer,
      begin: writer,
      end: writer,
    });
  }
}
