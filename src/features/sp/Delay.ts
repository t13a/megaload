import { StreamProcessorContext } from ".";

export const Delay = <I, O>(time: number) =>
  async function* ({ input, signal, ...context }: StreamProcessorContext<I>) {
    const logger = context.logger.create(Delay.name);
    logger.begin();

    for await (const value of input) {
      if (signal.aborted) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, time));

      yield value;
    }

    logger.end();
  };
