export type ReadFromAsncIterableProps<R> = AsyncIterable<R>;

export const ReadFromAsyncIterable = <R>(
  iterable: ReadFromAsncIterableProps<R>,
) => {
  let iterator: AsyncIterator<R>;
  return new ReadableStream<R>({
    start() {
      iterator = iterable[Symbol.asyncIterator]();
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
  });
};
