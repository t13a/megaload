import { BufferedWriter, Log, Writer } from "..";

export const noBuffer =
  (next: BufferedWriter): Writer =>
  (log: Log) =>
    next([log]);
