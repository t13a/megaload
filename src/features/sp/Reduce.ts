import { StreamProcessor } from ".";

export const Reduce = <I, O>(
  callback: (output: O, value: I) => O,
  initialValue: O,
): StreamProcessor<I, O> =>
  async function* ({ input, signal, ...context }) {
    const logger = context.logger.create(Reduce.name);
    logger.begin();

    let output = initialValue;

    for await (const value of input) {
      if (signal.aborted) {
        logger.end();
        return;
      }

      output = callback(output, value);
    }

    yield output;

    logger.end();
  };
