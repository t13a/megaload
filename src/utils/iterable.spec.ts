import { consume, reduce, toArray, toAsyncIterable } from ".";

describe("consume", () => {
  it("returns no value but passes all values to the callback", async () => {
    const input = (async function* () {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
      yield 5;
    })();
    const output: number[] = [];
    const callback = (n: number) => output.push(n);
    await consume(input, callback);
    expect(output).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it("just runs the input if the callback not specified", async () => {
    const output: number[] = [];
    const input = (async function* () {
      output.push(1);
      output.push(2);
      output.push(3);
      output.push(4);
      output.push(5);
    })();
    await consume(input);
    expect(output).toStrictEqual([1, 2, 3, 4, 5]);
  });
});

describe("reduce", () => {
  it("returns the accumulated value from the input", async () => {
    const input = (async function* () {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
      yield 5;
    })();
    const callback = (o: number, n: number) => o + n;
    const output = await reduce(input, callback, 0);
    expect(output).toBe(15);
  });

  it("returns the initial value if the input is empty", async () => {
    const input = (async function* () {})();
    const callback = (o: number, n: number) => o + n;
    const output = await reduce(input, callback, 0);
    expect(output).toBe(0);
  });
});

describe("toArray", () => {
  it("transforms an async iterable into an array", async () => {
    const asyncIterable = async function* () {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
      yield 5;
    };
    const array = await toArray(asyncIterable());
    expect(array).toStrictEqual([1, 2, 3, 4, 5]);
  });
});

describe("toAsyncIterable", () => {
  it("transforms an iterable into an async iterable", async () => {
    const iterable = [1, 2, 3, 4, 5];
    const asyncIterable = toAsyncIterable(iterable);
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();
    expect((await asyncIterator.next()).value).toBe(1);
    expect((await asyncIterator.next()).value).toBe(2);
    expect((await asyncIterator.next()).value).toBe(3);
    expect((await asyncIterator.next()).value).toBe(4);
    expect((await asyncIterator.next()).value).toBe(5);
    expect((await asyncIterator.next()).done).toBe(true);
  });
});
