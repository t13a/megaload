import { StreamProcessor } from ".";

export const Map = <I, O>(callback: (value: I) => O): StreamProcessor<I, O> =>
  async function* ({ input, signal, ...context }) {
    const logger = context.logger.create(Map.name);
    logger.begin();

    for await (const value of input) {
      if (signal.aborted) {
        break;
      }

      yield callback(value);
    }

    logger.end();
  };
