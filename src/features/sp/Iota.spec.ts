import { EmptyLogger } from "@/utils/logger";
import { EmptyInput } from ".";
import { Iota } from "./Iota";

describe("Iota", () => {
  it("returns numbers starting from zero", async () => {
    const processor = Iota({});

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const asyncIterable = processor({ input, signal, logger });
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).value).toBe(0);
    expect((await asyncIterator.next()).value).toBe(1);
    expect((await asyncIterator.next()).value).toBe(2);
    expect((await asyncIterator.next()).value).toBe(3);
    expect((await asyncIterator.next()).value).toBe(4);
  });

  it("returns numbers starting `first` to before `last`", async () => {
    const processor = Iota({ first: 2, last: 4 });

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const asyncIterable = processor({ input, signal, logger });
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).value).toBe(2);
    expect((await asyncIterator.next()).value).toBe(3);
    expect((await asyncIterator.next()).done).toBe(true);
  });

  it("returns nothing if `first` is larger than `last`", async () => {
    const processor = Iota({ first: 4, last: 2 });

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const asyncIterable = processor({ input, signal, logger });
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).done).toBe(true);
  });

  it("returns nothing if `first` and `last` is equal", async () => {
    const processor = Iota({ first: 3, last: 3 });

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const asyncIterable = processor({ input, signal, logger });
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).done).toBe(true);
  });
});
