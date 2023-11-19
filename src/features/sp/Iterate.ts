import { StreamProcessor } from ".";

export const Iterate = <O>(
  callback: Iterable<O> | AsyncIterable<O>,
): StreamProcessor<void, O> =>
  async function* ({ signal, ...context }) {
    const logger = context.logger.create(Iterate.name);
    logger.begin();

    for await (const value of callback) {
      if (signal.aborted) {
        break;
      }

      yield value;
    }

    logger.end();
  };
