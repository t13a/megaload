import { Log, LogOperator, Writer } from "..";

export const map = (
  operator: LogOperator | LogOperator[],
  next: Writer,
): Writer => {
  const aux = () => {
    if (Array.isArray(operator)) {
      return operator.reduce((l, r) => (x) => r(l(x)));
    } else {
      return operator;
    }
  };
  const fn = aux();
  return (log: Log) => {
    next(fn(log));
  };
};
