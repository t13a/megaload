import { StreamProcessorContext } from ".";

export type ListenThresholdFactors = {
  readonly count?: number;
  readonly time?: number;
};

export const Listen = <I>(
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

    for await (const value of input) {
      if (signal.aborted) {
        break;
      }

      count++;
      const time = new Date().getTime() - beginAt;

      if (
        (threshold.count !== undefined && count >= threshold.count) ||
        (threshold.time !== undefined && time >= threshold.time)
      ) {
        await new Promise((resolve) => setTimeout(resolve));

        count = 0;
        beginAt = new Date().getTime();
      }

      yield value;
    }

    logger.end();
  };
