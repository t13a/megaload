import { DefaultLogger } from "./DefaultLogger";

export class ConsoleLogger extends DefaultLogger {
  constructor(id: string) {
    super(id, {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
      begin: console.debug,
      end: console.debug,
    });
  }
}
