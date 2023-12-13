import {
  HookCallback,
  HookCallbackRegistry,
  HookName,
  HookPayload,
  Hooks,
  Register,
  Trigger,
  Unregister,
} from ".";

export class SingleHookCallbackRegistry<H extends Hooks>
  implements HookCallbackRegistry<H>
{
  private callbacks: Map<HookName<H>, HookCallback<H, any>> = new Map();

  readonly register: Register<H> = <N extends HookName<H>>(
    name: N,
    callback: HookCallback<H, N>,
  ): Unregister => {
    if (this.callbacks.get(name)) {
      throw Error(`The hook ${name} is already registered`);
    }
    this.callbacks.set(name, callback);
    return () => {
      if (this.callbacks.get(name) !== callback) {
        return;
      }
      this.callbacks.delete(name);
    };
  };

  readonly trigger: Trigger<H> = <N extends HookName<H>>(
    name: N,
    payload: HookPayload<H, N>,
  ) => {
    const callback = this.callbacks.get(name);
    if (!callback) {
      return;
    }
    callback(payload);
  };
}
