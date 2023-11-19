import { StreamProcessor, StreamProcessorContext } from ".";

export type DelayProps<I, O> = {
  readonly processor: StreamProcessor<I, O>;
  readonly threshold: {
    readonly count?: number;
    readonly time?: number;
  };
};

export const Delay = <I, O>({
  processor,
  threshold = {
    count: 1000,
    time: 1000,
  },
}: DelayProps<I, O>) =>
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
        logger.debug("Threshold exceeded");

        count = 0;
        beginAt = endAt;

        await new Promise((resolve) => setTimeout(resolve));
      }
    }

    logger.end();
  };
