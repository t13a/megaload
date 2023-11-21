import {
  CountProps,
  DelayProps,
  count as countNumber,
  format,
  isPrime,
} from ".";
import { Dipatch } from "../Dispatch";

export const CountPrimeHardCoded =
  ({ from, to }: CountProps, { time }: DelayProps): Dipatch =>
  async ({ signal, ...context }) => {
    const beginAt = new Date().getTime();

    // Initialize result.
    let result = 0;

    // Initialize start time.
    let startTime = new Date().getTime();

    // Enumerate numbers.
    for (const n of countNumber({ from, to })) {
      // Listen events if threshold time exceeded.
      const processTime = new Date().getTime() - startTime;
      if (processTime >= time) {
        await new Promise((resolve) => setTimeout(resolve));
        startTime = new Date().getTime();
      }

      // Exit for-loop if aborted.
      if (signal.aborted) {
        break;
      }

      // Increment result if the number is a prime.
      if (isPrime(n)) {
        result++;
      }
    }

    const endAt = new Date().getTime();
    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.writer(`result = ${format(result)}`);
    context.writer(`n = ${format(n)} (${format(from)}~${format(to)})`);
    context.writer(`ms = ${format(ms)}`);
    context.writer(`iops = ${format(iops)}`);
  };
