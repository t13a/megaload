import { map } from ".";
import { DefaultLogger, Log, LogOperator, Writer } from "..";

const createTestWriter =
  (logs: Log[]): Writer =>
  (log) =>
    logs.push(log);

describe("map", () => {
  it("applies an operator function to each log", () => {
    const uppercase: LogOperator = (log) => {
      return { ...log, data: String(log.data).toUpperCase() };
    };
    const logs: Log[] = [];
    const logger = new DefaultLogger(map(uppercase, createTestWriter(logs)));
    logger.debug("foo");
    logger.debug("bar");
    logger.debug("baz");
    expect(logs.map((log) => log.data)).toStrictEqual(["FOO", "BAR", "BAZ"]);
  });
});
