import { Log, Writer } from "..";

export const share =
  (...writers: Writer[]): Writer =>
  (log: Log) => {
    writers.forEach((writer) => writer(log));
  };
