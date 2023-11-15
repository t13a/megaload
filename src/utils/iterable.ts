export const toAsyncIterable = async function* <T>(
  iterable: Iterable<T>,
): AsyncIterable<T> {
  for (const value of iterable) {
    yield value;
  }
};
