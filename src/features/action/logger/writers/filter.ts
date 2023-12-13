import { Log, LogPredicate, Writer } from "..";

export const filter = (
  predicate: LogPredicate | LogPredicate[],
  next: Writer,
): Writer => {
  const aux = () => {
    if (Array.isArray(predicate)) {
      return predicate.reduce((l, r) => (x) => l(x) && r(x));
    } else {
      return predicate;
    }
  };
  const fn = aux();
  return (log: Log) => {
    if (fn(log)) {
      next(log);
    }
  };
};
