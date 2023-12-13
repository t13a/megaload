import { formatData } from ".";
import { DefaultLogger, Log, Writer } from "..";
import { map } from "../writers";

const createTestWriter =
  (logs: Log[]): Writer =>
  (log) =>
    logs.push(log);

describe("formatData", () => {
  it("formats data as text", () => {
    const logs: Log[] = [];
    const logger = new DefaultLogger(map(formatData(), createTestWriter(logs)));
    logger.debug("test");
    logger.debug(true);
    logger.debug(false);
    logger.debug(123);
    logger.debug([1, 2, 3]);
    logger.debug({ foo: "bar" });
    expect(logs.map((log) => log.data)).toStrictEqual([
      "test",
      "true",
      "false",
      "123",
      `[
  1,
  2,
  3
]`,
      `{
  "foo": "bar"
}`,
    ]);
  });

  it("formats timestamp/level/name/data when verbose mode is enabled", () => {
    const src1: Log = {
      timestamp: new Date("2006-01-02T15:04:05.789"),
      level: "debug",
      data: "data",
    };
    const dst1: Log = formatData({ mode: "verbose" })(src1);
    expect(dst1.data).toBe("[2006-01-02T15:04:05.789] [DEBUG] data");

    const src2: Log = {
      timestamp: new Date("1970-01-01T00:00:00.000"),
      level: "debug",
      name: "name",
      data: "data",
    };
    const dst2: Log = formatData({ mode: "verbose" })(src2);
    expect(dst2.data).toBe("[1970-01-01T00:00:00.000] [DEBUG] [name] data");
  });
});
