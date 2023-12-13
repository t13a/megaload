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

export class MultiHookCallbackRegistry<H extends Hooks>
  implements HookCallbackRegistry<H>
{
  private callbacks: Map<HookName<H>, Set<HookCallback<H, any>>> = new Map();

  readonly register: Register<H> = <N extends HookName<H>>(
    name: N,
    callback: HookCallback<H, N>,
  ): Unregister => {
    const callbacksByName = this.callbacks.get(name) ?? new Set();
    callbacksByName.add(callback);
    this.callbacks.set(name, callbacksByName);
    return () => callbacksByName.delete(callback);
  };

  readonly trigger: Trigger<H> = <N extends HookName<H>>(
    name: N,
    payload: HookPayload<H, N>,
  ) => {
    const callbacksByName = this.callbacks.get(name);
    if (!callbacksByName) {
      return;
    }
    callbacksByName.forEach((callback) => callback(payload));
  };
}
