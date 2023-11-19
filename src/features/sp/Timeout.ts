import { StreamProcessor, StreamProcessorContext } from ".";

export type TimeoutProps<I, O> = {
  readonly processor: StreamProcessor<I, O>;
  readonly threshold: {
    readonly count?: number;
    readonly time?: number;
  };
  readonly abortController?: AbortController;
};

export const Timeout = <I, O>({
  processor,
  threshold,
  abortController = new AbortController(),
}: TimeoutProps<I, O>) =>
  async function* ({ input, ...context }: StreamProcessorContext<I>) {
    const logger = context.logger.create(Timeout.name);
    logger.begin();

    const signal = abortController.signal;

    let count = 0;
    const beginAt = new Date().getTime();

    for await (const value of processor({ input, signal, logger })) {
      yield value;

      count++;
      const endAt = new Date().getTime();

      if (
        (threshold.count !== undefined && count >= threshold.count) ||
        (threshold.time !== undefined && endAt - beginAt >= threshold.time)
      ) {
        logger.debug("Threshold exceeded");

        abortController.abort();
        break;
      }
    }

    logger.end();
  };
