import { StreamProcessor, StreamProcessorContext } from ".";

export type ListenThresholdFactors = {
  readonly count?: number;
  readonly time?: number;
};

export const Listen = <I, O>(
  processor: StreamProcessor<I, O>,
  threshold: ListenThresholdFactors = {
    count: Number.MAX_SAFE_INTEGER,
    time: 100,
  },
) =>
  async function* ({ input, signal, ...context }: StreamProcessorContext<I>) {
    const logger = context.logger.create(Listen.name);
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
