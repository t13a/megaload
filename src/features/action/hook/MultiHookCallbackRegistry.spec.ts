import { HookCallback, HookName } from ".";
import { MultiHookCallbackRegistry } from "./MultiHookCallbackRegistry";

type FooHooks = {
  test: { value: number };
};
type FooHookType = HookName<FooHooks>;
type FootHookCallback<Type extends FooHookType> = HookCallback<FooHooks, Type>;

describe("MultiHookCallbackRegistry", () => {
  it("registers multiple callbacks by name", async () => {
    const registry = new MultiHookCallbackRegistry<FooHooks>();

    const values: number[] = [];
    const handleTest1: FootHookCallback<"test"> = ({ value }) => {
      values.push(value);
    };
    const handleTest2: FootHookCallback<"test"> = ({ value }) => {
      values.push(value * 2);
    };

    registry.register("test", handleTest1);
    registry.register("test", handleTest2);
    registry.trigger("test", { value: 1 });
    expect(values).toStrictEqual([1, 2]);
  });

  it("unregisters multiple callbacks", async () => {
    const registry = new MultiHookCallbackRegistry<FooHooks>();

    const values: number[] = [];
    const handleTest1: FootHookCallback<"test"> = ({ value }) => {
      values.push(value);
    };
    const handleTest2: FootHookCallback<"test"> = ({ value }) => {
      values.push(value * 2);
    };

    const unregister1 = registry.register("test", handleTest1);
    const unregister2 = registry.register("test", handleTest2);
    unregister1();
    unregister2();
    registry.trigger("test", { value: 1 }); // do nothing
    expect(values).toStrictEqual([]);
  });

  it("ignores to register same callback by name", async () => {
    const registry = new MultiHookCallbackRegistry<FooHooks>();

    const values: number[] = [];
    const handleTest: FootHookCallback<"test"> = ({ value }) => {
      values.push(value);
    };

    registry.register("test", handleTest);
    registry.register("test", handleTest); // do nothing
    registry.trigger("test", { value: 1 });
    expect(values).toStrictEqual([1]);
  });
});
