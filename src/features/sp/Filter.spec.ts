import { EmptyLogger, toArray, toAsyncIterable } from "@/utils";
import { Filter } from ".";

describe("Filter", () => {
  it("filters the input", async () => {
    const odd = (value: number) => value % 2 !== 0;
    const processor = Filter(odd);

    const input = toAsyncIterable([1, 2, 3, 4, 5]);
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const output = await toArray(processor({ input, signal, logger }));
    expect(output).toStrictEqual([1, 3, 5]);
  });
});
