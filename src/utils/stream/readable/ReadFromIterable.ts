export type ReadFromIterableProps<R> = Iterable<R>;

export const ReadFromIterable = <R>(iterable: ReadFromIterableProps<R>) => {
  let iterator: Iterator<R>;
  return new ReadableStream<R>({
    start() {
      iterator = iterable[Symbol.iterator]();
    },
    pull(controller) {
      let result;

      try {
        result = iterator.next();
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
