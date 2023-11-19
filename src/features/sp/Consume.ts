import { StreamProcessor } from ".";

export const Consume = <I>(
  callback?: (value: I) => any | PromiseLike<any>,
): StreamProcessor<I, void> =>
  async function* ({ input, signal, ...context }) {
    const logger = context.logger.create(Consume.name);
    logger.begin();

    for await (const value of input) {
      if (signal.aborted) {
        break;
      }

      if (callback) {
        await callback(value);
      }
    }

    logger.end();
  };
