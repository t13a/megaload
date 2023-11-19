import { Consume, EmptyInput, Filter, Iterate } from "@/features/sp";
import { EmptyLogger, consume } from "@/utils";
import { DefaultBlockingQueue } from "@/utils/queue";
import { count, format, isPrime } from ".";
import { TestDipatcher } from "../TestDispatcher";

export type CountPrimeWithSPProps = {
  from: number;
  to: number;
};

export const CountPrimeWithSP =
  ({ from, to }: CountPrimeWithSPProps): TestDipatcher =>
  async ({ signal, ...context }) => {
    let result = 0;

    const beginAt = new Date().getTime();

    const p1 = Iterate(count({ from, to }));
    const p2 = Filter(isPrime);
    const p3 = Consume(() => result++);

    const q1 = new DefaultBlockingQueue<number>();
    const q2 = new DefaultBlockingQueue<number>();

    const input = new EmptyInput();
    const logger = new EmptyLogger();
    await Promise.all([
      q1.enqueueAll(p1({ input, signal, logger })),
      q2.enqueueAll(p2({ input: q1, signal, logger })),
      consume(p3({ input: q2, signal, logger })),
    ]);

    const endAt = new Date().getTime();

    context.logger.info(`result = ${format(result)}`);

    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.logger.info(`n = ${format(n)} (${format(from)}~${format(to)})`);
    context.logger.info(`ms = ${format(ms)}`);
    context.logger.info(`iops = ${format(iops)}`);
  };
