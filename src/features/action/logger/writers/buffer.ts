import { BufferedWriter, Log, Writer } from "..";

export const buffer = (time: number, next: BufferedWriter): Writer => {
  const logs: Log[] = [];
  let timeoutId: number | undefined;

  return (log: Log) => {
    logs.push(log);

    if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        timeoutId = undefined;
        next(logs);
        logs.length = 0;
      }, time);
    }
  };
};
