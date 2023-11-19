import { Consume, Delay, EmptyInput, Filter, Iterate } from "@/features/sp";
import { consume } from "@/utils";
import { DefaultLogger } from "@/utils/logger";
import { DefaultBlockingQueue } from "@/utils/queue";
import { CountProps, DelayProps, count, format, isPrime } from ".";
import { Dipatcher } from "../Dispatcher";

export const CountPrimeUsingOwnStreamProcessor =
  ({ from, to }: CountProps, { time }: DelayProps): Dipatcher =>
  async ({ signal, ...context }) => {
    let result = 0;

    const beginAt = new Date().getTime();

    const p1 = Delay(Iterate(count({ from, to })), { time });
    const p2 = Filter(isPrime);
    const p3 = Consume(() => result++);

    const q1 = new DefaultBlockingQueue<number>();
    const q2 = new DefaultBlockingQueue<number>();

    const input = new EmptyInput();
    const logger = DefaultLogger.of(context.writer);
    await Promise.all([
      q1.enqueueAll(p1({ input, signal, logger })),
      q2.enqueueAll(p2({ input: q1, signal, logger })),
      consume(p3({ input: q2, signal, logger })),
    ]);

    const endAt = new Date().getTime();

    context.writer(`result = ${format(result)}`);

    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.writer(`n = ${format(n)} (${format(from)}~${format(to)})`);
    context.writer(`ms = ${format(ms)}`);
    context.writer(`iops = ${format(iops)}`);
  };
