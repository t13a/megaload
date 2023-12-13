import { filter } from ".";
import { DefaultLogger, Log, LogPredicate, Writer } from "..";

const createTestWriter =
  (logs: Log[]): Writer =>
  (log) =>
    logs.push(log);

describe("filter", () => {
  it("test an predicate function to each log", () => {
    const fizz: LogPredicate = (log) =>
      typeof log.data === "number" && log.data % 15 === 0;
    const logs: Log[] = [];
    const logger = new DefaultLogger(filter(fizz, createTestWriter(logs)));
    for (let n = 1; n <= 30; n++) {
      logger.debug(n);
    }
    expect(logs.map((log) => log.data)).toStrictEqual([15, 30]);
  });
});
