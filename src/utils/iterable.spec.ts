import { toAsyncIterable } from "./iterable";

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
