import { Filter, Listen, PipelineBuilder, Reduce } from "@/features/sp";
import { toArray } from "@/utils";
import { DefaultLogger } from "@/utils/logger";
import { CountProps, DelayProps, formatNumber, isPrime } from ".";
import { Dipatch } from "../Dispatch";

export const CountPrimeUsingOwnStreamProcessor =
  ({ from, to }: CountProps, { time }: DelayProps): Dipatch =>
  async ({ signal, ...context }) => {
    const beginAt = new Date().getTime();

    // Initialize values.
    const input = (async function* () {
      for (let n = from; n <= to; n++) {
        yield n;
      }
    })();
    const logger = DefaultLogger.of(context.writer);

    // Build the pipeline.
    const pipeline = new PipelineBuilder({ input, signal, logger })
      .through(Listen({ time })) // Listen events if threshold time exceeded.
      .through(Filter(isPrime)) // Output if number is prime.
      .through(Reduce((output: number) => ++output, 0)) // Increment.
      .build();

    // Run the pipeline.
    const count = await toArray(pipeline);

    const endAt = new Date().getTime();
    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.writer(`count = ${count}`);
    context.writer(
      `n = ${formatNumber(n)} (${formatNumber(from)}~${formatNumber(to)})`,
    );
    context.writer(`ms = ${formatNumber(ms)}`);
    context.writer(`iops = ${formatNumber(iops)}`);
  };
