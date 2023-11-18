import { Logger } from "./Logger";

export class EmptyLogger implements Logger {
  readonly id = "empty";

  create(subId?: string | undefined): Logger {
    return this;
  }

  debug(...data: any[]): void {}

  info(...data: any[]): void {}

  warn(...data: any[]): void {}

  error(...data: any[]): void {}

  begin(): void {}

  end(): void {}
}
