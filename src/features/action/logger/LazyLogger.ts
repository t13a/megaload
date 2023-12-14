import { Logger, Writer } from ".";

export class LazyLogger implements Logger {
  constructor(
    private callback: () => Writer,
    private name?: string,
  ) {}

  get(name: string): Logger {
    return new LazyLogger(this.callback, name);
  }

  debug(data?: any): void {
    this.callback()({
      timestamp: new Date(),
      level: "debug",
      name: this.name,
      data,
    });
  }

  info(data?: any): void {
    this.callback()({
      timestamp: new Date(),
      level: "info",
      name: this.name,
      data,
    });
  }

  warn(data?: any): void {
    this.callback()({
      timestamp: new Date(),
      level: "warn",
      name: this.name,
      data,
    });
  }

  error(data?: any): void {
    this.callback()({
      timestamp: new Date(),
      level: "error",
      name: this.name,
      data,
    });
  }
}
