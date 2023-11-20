import { EmptyInput, Filter, Iterate, Listen, Reduce } from "@/features/sp";
import { toArray } from "@/utils";
import { DefaultLogger } from "@/utils/logger";
import { CountProps, DelayProps, count, format, isPrime } from ".";
import { Dipatch } from "../Dispatch";

export const CountPrimeUsingOwnStreamProcessor =
  ({ from, to }: CountProps, { time }: DelayProps): Dipatch =>
  async ({ signal, ...context }) => {
    const beginAt = new Date().getTime();

    const p1 = Listen(Iterate(count({ from, to })), { time });
    const p2 = Filter(isPrime);
    const p3 = Reduce((count: number) => ++count, 0);

    const logger = DefaultLogger.of(context.writer);
    const p1i = p1({ input: new EmptyInput(), signal, logger });
    const p2i = p2({ input: p1i, signal, logger });
    const p3i = p3({ input: p2i, signal, logger });
    const result = await toArray(p3i);

    const endAt = new Date().getTime();

    context.writer(`result = ${result}`);

    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.writer(`n = ${format(n)} (${format(from)}~${format(to)})`);
    context.writer(`ms = ${format(ms)}`);
    context.writer(`iops = ${format(iops)}`);
  };
