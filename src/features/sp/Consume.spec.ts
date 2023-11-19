import { EmptyLogger, consume } from "@/utils";
import { Consume } from ".";

describe("Consume", () => {
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
    const processor = Consume(callback);
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    await consume(processor({ input, signal, logger }));
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
    const processor = Consume();
    const signal = new AbortController().signal;
    const logger = new EmptyLogger();
    await consume(processor({ input, signal, logger }));
    expect(output).toStrictEqual([1, 2, 3, 4, 5]);
  });
});
