import { StreamProcessor, StreamProcessorContext } from ".";

export const Delay = <I, O>(processor: StreamProcessor<I, O>, time: number) =>
  async function* ({ input, signal, ...context }: StreamProcessorContext<I>) {
    const logger = context.logger.create(Delay.name);
    logger.begin();

    for await (const value of processor({ input, signal, logger })) {
      await new Promise((resolve) => setTimeout(resolve, time));

      yield value;
    }

    logger.end();
  };
