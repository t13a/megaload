import { StreamProcessor, StreamProcessorContext } from ".";

export type DelayFactors = {
  readonly count?: number;
  readonly time?: number;
};

export const Delay = <I, O>(
  processor: StreamProcessor<I, O>,
  threshold: DelayFactors = {
    count: Number.MAX_SAFE_INTEGER,
    time: 100,
  },
) =>
  async function* ({ input, signal, ...context }: StreamProcessorContext<I>) {
    const logger = context.logger.create(Delay.name);
    logger.begin();

    let count = 0;
    let beginAt = new Date().getTime();

    for await (const value of processor({ input, signal, logger })) {
      yield value;

      count++;
      const endAt = new Date().getTime();

      if (
        (threshold.count !== undefined && count >= threshold.count) ||
        (threshold.time !== undefined && endAt - beginAt >= threshold.time)
      ) {
        count = 0;
        beginAt = endAt;

        await new Promise((resolve) => setTimeout(resolve));
      }
    }

    logger.end();
  };
