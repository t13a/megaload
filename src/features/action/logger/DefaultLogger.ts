import { Logger, Writer } from ".";

export class DefaultLogger implements Logger {
  constructor(
    private writer: Writer,
    private name?: string,
  ) {}

  get(name: string): Logger {
    return new DefaultLogger(this.writer, name);
  }

  debug(data?: any): void {
    this.writer({
      timestamp: new Date(),
      level: "debug",
      name: this.name,
      data,
    });
  }

  info(data?: any): void {
    this.writer({
      timestamp: new Date(),
      level: "info",
      name: this.name,
      data,
    });
  }

  warn(data?: any): void {
    this.writer({
      timestamp: new Date(),
      level: "warn",
      name: this.name,
      data,
    });
  }

  error(data?: any): void {
    this.writer({
      timestamp: new Date(),
      level: "error",
      name: this.name,
      data,
    });
  }
}
