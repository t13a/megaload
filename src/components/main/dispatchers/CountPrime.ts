import { CountProps, count, format, isPrime } from ".";
import { Dipatcher } from "../Dispatcher";

export const CountPrime =
  ({ from, to }: CountProps): Dipatcher =>
  async (context) => {
    let result = 0;

    const beginAt = new Date().getTime();

    for (const n of count({ from, to })) {
      if (isPrime(n)) {
        result++;
      }
    }

    const endAt = new Date().getTime();

    context.logger.info(`result = ${format(result)}`);

    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.logger.info(`n = ${format(n)} (${format(from)}~${format(to)})`);
    context.logger.info(`ms = ${format(ms)}`);
    context.logger.info(`iops = ${format(iops)}`);
  };
