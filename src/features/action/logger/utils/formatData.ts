import { Log, LogOperator } from "..";

export const formatData = (options?: { mode?: "verbose" }): LogOperator => {
  const pad2 = (n: number) => `${n < 10 ? "0" : ""}${n}`;
  const pad3 = (n: number) => `${n < 10 ? "00" : n < 100 ? "0" : ""}${n}`;
  const formatTimestamp = (date: Date) => {
    return (
      date.getFullYear() +
      "-" +
      pad2(date.getMonth() + 1) +
      "-" +
      pad2(date.getDate()) +
      "T" +
      pad2(date.getHours()) +
      ":" +
      pad2(date.getMinutes()) +
      ":" +
      pad2(date.getSeconds()) +
      "." +
      pad3(date.getMilliseconds())
    );
  };
  const stringify = (data: any): any => {
    if (data instanceof Error) {
      return data.stack ? data.stack : data;
    }
    switch (typeof data) {
      case "string":
        return data;
      case "bigint":
      case "boolean":
      case "number":
        return data.toString();
      default:
        return JSON.stringify(data, null, 2);
    }
  };
  const fn =
    options?.mode === "verbose"
      ? (log: Log) =>
          log.name
            ? `[${formatTimestamp(
                log.timestamp,
              )}] [${log.level.toUpperCase()}] [${log.name}] ${stringify(
                log.data,
              )}`
            : `[${formatTimestamp(
                log.timestamp,
              )}] [${log.level.toUpperCase()}] ${stringify(log.data)}`
      : (log: Log) => stringify(log.data);
  return (log: Log) => {
    return { ...log, data: fn(log) };
  };
};
