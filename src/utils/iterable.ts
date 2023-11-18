export const toArray = async <T>(asyncIterable: AsyncIterable<T>) => {
  const array: T[] = [];
  for await (const value of asyncIterable) {
    array.push(value);
  }
  return array;
};

export const toAsyncIterable = async function* <T>(
  iterable: Iterable<T>,
): AsyncIterable<T> {
  for (const value of iterable) {
    yield value;
  }
};
