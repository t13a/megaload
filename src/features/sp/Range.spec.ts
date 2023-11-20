import { EmptyLogger } from "@/utils/logger";
import { EmptyInput } from ".";
import { Range } from "./Range";

describe("Range", () => {
  it("returns numbers starting from zero", async () => {
    const processor = Range({});

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

  it("returns numbers starting `start`", async () => {
    const processor = Range({ start: 2 });

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const asyncIterable = processor({ input, signal, logger });
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).value).toBe(2);
    expect((await asyncIterator.next()).value).toBe(3);
    expect((await asyncIterator.next()).value).toBe(4);
    expect((await asyncIterator.next()).value).toBe(5);
    expect((await asyncIterator.next()).value).toBe(6);
  });

  it("returns numbers to before `end`", async () => {
    const processor = Range({ end: 4 });

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const asyncIterable = processor({ input, signal, logger });
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).value).toBe(0);
    expect((await asyncIterator.next()).value).toBe(1);
    expect((await asyncIterator.next()).value).toBe(2);
    expect((await asyncIterator.next()).value).toBe(3);
  });

  it("returns numbers starting `start` to before `end`", async () => {
    const processor = Range({ start: 2, end: 4 });

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const asyncIterable = processor({ input, signal, logger });
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).value).toBe(2);
    expect((await asyncIterator.next()).value).toBe(3);
    expect((await asyncIterator.next()).done).toBe(true);
  });

  it("returns nothing if `start` is larger than `end`", async () => {
    const processor = Range({ start: 4, end: 2 });

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const asyncIterable = processor({ input, signal, logger });
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).done).toBe(true);
  });

  it("returns nothing if `start` and `end` is equal", async () => {
    const processor = Range({ start: 3, end: 3 });

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const asyncIterable = processor({ input, signal, logger });
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).done).toBe(true);
  });
});
