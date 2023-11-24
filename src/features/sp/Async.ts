import { StreamProcessor, StreamProcessorContext } from ".";

export const Async = <I, O>(
  processor: StreamProcessor<I, O>,
  thresholdTime: number = 100,
) =>
  async function* (context: StreamProcessorContext<I>) {
    let beginAt = new Date().getTime();

    for await (const value of processor(context)) {
      yield value;

      const time = new Date().getTime() - beginAt;
      if (time >= thresholdTime) {
        await new Promise((resolve) => setTimeout(resolve));
        beginAt = time;
      }
    }
  };
