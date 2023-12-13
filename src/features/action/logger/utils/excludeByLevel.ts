import { Level, Log, LogPredicate } from "..";

export const excludeByLevel =
  (...levels: Level[]): LogPredicate =>
  (log: Log) =>
    !levels.includes(log.level);
