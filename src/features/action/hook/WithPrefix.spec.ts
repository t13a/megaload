import {
  HookCallback,
  HookName,
  SingleHookCallbackRegistry,
  Trigger,
  WithPrefix,
  extractTrigger,
} from ".";

type FooHooks = {
  test: { value: number };
};

type BarHooks = {
  test: { value: string };
};

type FooBarHooks = WithPrefix<"foo-", FooHooks> & WithPrefix<"bar-", BarHooks>;
type FooBarHookType = HookName<FooBarHooks>;
type FooBarHookCallback<Type extends FooBarHookType> = HookCallback<
  FooBarHooks,
  Type
>;

describe("WithPrefix", () => {
  it("combines multiple hooks", async () => {
    type FooBarHooks = WithPrefix<"foo-", FooHooks> &
      WithPrefix<"bar-", BarHooks>;
    type FooBarHookType = HookName<FooBarHooks>;
    type FooBarHookCallback<Type extends FooBarHookType> = HookCallback<
      FooBarHooks,
      Type
    >;

    const fooValues: number[] = [];
    const handleFooTest: FooBarHookCallback<"foo-test"> = ({ value }) => {
      fooValues.push(value);
    };

    const barValues: string[] = [];
    const handleBarTest: FooBarHookCallback<"bar-test"> = ({ value }) => {
      barValues.push(value);
    };

    const registry = new SingleHookCallbackRegistry<FooBarHooks>();
    registry.register("foo-test", handleFooTest);
    registry.register("bar-test", handleBarTest);

    registry.trigger("foo-test", { value: 1 });
    expect(fooValues).toStrictEqual([1]);

    registry.trigger("bar-test", { value: "a" });
    expect(barValues).toStrictEqual(["a"]);
  });
});

describe("extractTrigger", () => {
  it("returns a trigger without prefix", async () => {
    const fooValues: number[] = [];
    const handleFooTest: FooBarHookCallback<"foo-test"> = ({ value }) => {
      fooValues.push(value);
    };

    const barValues: string[] = [];
    const handleBarTest: FooBarHookCallback<"bar-test"> = ({ value }) => {
      barValues.push(value);
    };

    const registry = new SingleHookCallbackRegistry<FooBarHooks>();
    registry.register("foo-test", handleFooTest);
    registry.register("bar-test", handleBarTest);

    const fooTrigger: Trigger<FooHooks> = extractTrigger(
      "foo-",
      registry.trigger,
    );
    fooTrigger("test", { value: 1 });
    expect(fooValues).toStrictEqual([1]);

    const barTrigger: Trigger<BarHooks> = extractTrigger(
      "bar-",
      registry.trigger,
    );
    barTrigger("test", { value: "a" });
    expect(barValues).toStrictEqual(["a"]);
  });
});
