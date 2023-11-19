import { CountProps, DelayProps, count, format, isPrime } from ".";
import { Dipatcher } from "../Dispatcher";

export const CountPrimeHardCoded =
  ({ from, to }: CountProps, { time }: DelayProps): Dipatcher =>
  async ({ signal, ...context }) => {
    let result = 0;

    const beginAt = new Date().getTime();

    let t1 = new Date().getTime();
    for (const n of count({ from, to })) {
      const t2 = new Date().getTime();
      if (t2 - t1 >= time) {
        await new Promise((resolve) => setTimeout(resolve));
        t1 = t2;
      }
      if (signal.aborted) {
        return;
      }
      if (isPrime(n)) {
        result++;
      }
    }

    const endAt = new Date().getTime();

    context.writer(`result = ${format(result)}`);

    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.writer(`n = ${format(n)} (${format(from)}~${format(to)})`);
    context.writer(`ms = ${format(ms)}`);
    context.writer(`iops = ${format(iops)}`);
  };
