import { EmptyLogger, toArray, toAsyncIterable } from "@/utils";
import { Reduce } from ".";

describe("Reduce", () => {
  it("accumulates the input", async () => {
    const sum = (output: number, value: number) => (output += value);
    const processor = Reduce({ callback: sum, initialValue: 0 });

    const input = toAsyncIterable([1, 2, 3, 4, 5]);
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const output = await toArray(processor({ input, signal, logger }));
    expect(output).toStrictEqual([15]);
  });
});
