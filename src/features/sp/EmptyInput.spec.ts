import { EmptyInput } from ".";

describe("EmptyInput", () => {
  it("always returns nothing", async () => {
    const input = new EmptyInput();
    const asyncIterator = input[Symbol.asyncIterator]();

    expect(await asyncIterator.next()).toStrictEqual({
      done: true,
      value: undefined,
    });
  });
});
