import { consume } from "@/utils";
import { Logger } from "@/utils/logger";
import { DefaultBlockingQueue } from "@/utils/queue";
import { EmptyInput, StreamProcessor } from ".";

export const toReadableStream = <R>(
  processor: StreamProcessor<any, R>,
  abortController: AbortController,
  logger: Logger,
) => {
  let iterator: AsyncIterator<R>;
  return new ReadableStream<R>({
    start() {
      const input = new EmptyInput();
      const signal = abortController.signal;
      iterator = processor({ input, signal, logger })[Symbol.asyncIterator]();
    },
    async pull(controller) {
      let result;
      try {
        result = await iterator.next();
      } catch (error) {
        controller.error(error);
        return;
      }
      if (result.done) {
        controller.close();
      } else {
        controller.enqueue(result.value);
      }
    },
    cancel(reason) {
      abortController.abort(reason);
    },
  });
};

export const toWritableStream = <W>(
  processor: StreamProcessor<W, any>,
  abortController: AbortController,
  logger: Logger,
) => {
  const input = new DefaultBlockingQueue<W>(1);
  return new WritableStream<W>({
    start(controller) {
      const signal = abortController.signal;
      new Promise(async () => {
        try {
          consume(processor({ input, signal, logger }));
        } catch (error) {
          controller.error(error);
        }
      });
    },
    async write(chunk: W) {
      input.enqueue({ value: chunk });
    },
    async close() {
      input.enqueue({ done: true, value: undefined });
    },
    abort(reason) {
      abortController.abort(reason);
    },
  });
};
