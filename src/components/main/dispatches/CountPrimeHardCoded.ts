import { CountProps, DelayProps, formatNumber, isPrime } from ".";
import { Dipatch } from "../Dispatch";

export const CountPrimeHardCoded =
  ({ from, to }: CountProps, { time }: DelayProps): Dipatch =>
  async ({ signal, ...context }) => {
    const beginAt = new Date().getTime();

    // Initialize variables;
    let result = 0;
    let startTime = new Date().getTime();

    // Loop the procedure.
    for (let n = from; n <= to; n++) {
      // Get process time.
      const processTime = new Date().getTime() - startTime;

      // Listen events if threshold time exceeded.
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
    context.writer(`result = ${formatNumber(result)}`);
    context.writer(
      `n = ${formatNumber(n)} (${formatNumber(from)}~${formatNumber(to)})`,
    );
    context.writer(`ms = ${formatNumber(ms)}`);
    context.writer(`iops = ${formatNumber(iops)}`);
  };
