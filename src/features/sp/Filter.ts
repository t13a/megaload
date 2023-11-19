import { StreamProcessor } from ".";

export const Filter = <I>(
  callback: (value: I) => boolean,
): StreamProcessor<I, I> =>
  async function* ({ input, signal, ...context }) {
    const logger = context.logger.create(Filter.name);
    logger.begin();

    for await (const value of input) {
      if (signal.aborted) {
        break;
      }

      if (callback(value)) {
        yield value;
      }
    }

    logger.end();
  };
