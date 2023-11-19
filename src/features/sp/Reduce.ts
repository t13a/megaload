import { StreamProcessor } from ".";

export type ReduceProps<I, O> = {
  readonly callback: (output: O, value: I) => O;
  readonly initialValue: O;
};

export const Reduce = <I, O>({
  callback,
  initialValue,
}: ReduceProps<I, O>): StreamProcessor<I, O> =>
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
