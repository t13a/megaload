import { toArray, toAsyncIterable } from "@/utils";
import { EmptyLogger } from "@/utils/logger";
import { Map } from ".";

describe("Map", () => {
  it("applies a function to the input", async () => {
    const twice = (value: number) => value * 2;
    const processor = Map(twice);

    const input = toAsyncIterable([1, 2, 3, 4, 5]);
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    const output = await toArray(processor({ input, signal, logger }));
    expect(output).toStrictEqual([2, 4, 6, 8, 10]);
  });
});
