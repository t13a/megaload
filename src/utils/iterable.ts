export const consume = async <I>(
  input: AsyncIterable<I>,
  callback: (value: I) => any = () => {},
) => {
  await reduce<I, void>(input, (output, value) => callback(value), undefined);
};

export const reduce = async <I, O>(
  input: AsyncIterable<I>,
  callback: (output: O, value: I) => O,
  initialValue: O,
) => {
  let output = initialValue;
  for await (const value of input) {
    output = callback(output, value);
  }
  return output;
};

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
