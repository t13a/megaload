import { HookCallback, HookName, SingleHookCallbackRegistry } from ".";

type FooHooks = {
  test: { value: number };
};
type FooHookType = HookName<FooHooks>;
type FootHookCallback<Type extends FooHookType> = HookCallback<FooHooks, Type>;

describe("SingleHookCallbackRegistry", () => {
  it("registers a callback by name", async () => {
    const registry = new SingleHookCallbackRegistry<FooHooks>();

    const values: number[] = [];
    const handleTest: FootHookCallback<"test"> = ({ value }) => {
      values.push(value);
    };

    registry.register("test", handleTest);
    registry.trigger("test", { value: 1 });
    expect(values).toStrictEqual([1]);
  });

  it("unregisters a callback", async () => {
    const registry = new SingleHookCallbackRegistry<FooHooks>();

    const values: number[] = [];
    const handleTest: FootHookCallback<"test"> = ({ value }) => {
      values.push(value);
    };

    const unregister = registry.register("test", handleTest);
    unregister();
    registry.trigger("test", { value: 1 }); // do nothing
    expect(values).toStrictEqual([]);
  });

  it("can not register if other callback with same name has already been registered", async () => {
    const registry = new SingleHookCallbackRegistry<FooHooks>();

    const handleTest1: FootHookCallback<"test"> = ({ value }) => {};
    const handleTest2: FootHookCallback<"test"> = ({ value }) => {};

    registry.register("test", handleTest1);
    try {
      registry.register("test", handleTest2);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      return;
    }
    fail();
  });
});
