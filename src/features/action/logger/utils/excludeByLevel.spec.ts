import { excludeByLevel } from ".";
import { DefaultLogger, Log, Writer } from "..";
import { filter } from "../writers";

const createTestWriter =
  (logs: Log[]): Writer =>
  (log) =>
    logs.push(log);

describe("excludeByLevel", () => {
  it("excludes by level", () => {
    const logs: Log[] = [];
    const logger = new DefaultLogger(
      filter(excludeByLevel("debug"), createTestWriter(logs)),
    );
    logger.debug("debug");
    logger.info("info");
    logger.warn("warn");
    logger.error("error");
    expect(logs.map((log) => log.data)).toStrictEqual([
      "info",
      "warn",
      "error",
    ]);
  });
});
