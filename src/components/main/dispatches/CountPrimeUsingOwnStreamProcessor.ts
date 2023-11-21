import {
  EmptyInput,
  Filter,
  Iterate,
  Listen,
  PipelineBuilder,
  Reduce,
} from "@/features/sp";
import { toArray } from "@/utils";
import { DefaultLogger } from "@/utils/logger";
import {
  CountProps,
  DelayProps,
  count as countNumber,
  format,
  isPrime,
} from ".";
import { Dipatch } from "../Dispatch";

export const CountPrimeUsingOwnStreamProcessor =
  ({ from, to }: CountProps, { time }: DelayProps): Dipatch =>
  async ({ signal, ...context }) => {
    const beginAt = new Date().getTime();

    // Build the pipeline.
    const input = new EmptyInput();
    const logger = DefaultLogger.of(context.writer);
    const pipeline = new PipelineBuilder({ input, signal, logger })
      .through(Iterate(countNumber({ from, to }))) // Enumerate numbers.
      .through(Listen({ time })) // Listen events if threshold time exceeded.
      .through(Filter(isPrime)) // Output if number is prime.
      .through(Reduce((output: number) => ++output, 0)) // Increment result.
      .build();

    // Run the pipeline.
    const result = await toArray(pipeline);

    const endAt = new Date().getTime();
    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.writer(`count = ${result}`);
    context.writer(`n = ${format(n)} (${format(from)}~${format(to)})`);
    context.writer(`ms = ${format(ms)}`);
    context.writer(`iops = ${format(iops)}`);
  };
