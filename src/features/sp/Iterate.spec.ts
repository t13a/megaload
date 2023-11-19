import { toArray, toAsyncIterable } from "@/utils";
import { EmptyLogger } from "@/utils/logger";
import { EmptyInput, Iterate } from ".";

describe("Iterate", () => {
  it("returns values from an iterable", async () => {
    const iterable = [1, 2, 3, 4, 5];
    const processor = Iterate(iterable);

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const output = await toArray(processor({ input, signal, logger }));
    expect(output).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it("returns values from an async iterable", async () => {
    const asyncIterable = toAsyncIterable([1, 2, 3, 4, 5]);
    const processor = Iterate(asyncIterable);

    const input = new EmptyInput();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const output = await toArray(processor({ input, signal, logger }));
    expect(output).toStrictEqual([1, 2, 3, 4, 5]);
  });
});
