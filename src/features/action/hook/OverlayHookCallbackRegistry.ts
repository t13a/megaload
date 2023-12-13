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

export class OverlayHookCallbackRegistry<H extends Hooks>
  implements HookCallbackRegistry<H>
{
  registries: HookCallbackRegistry<H>[];

  constructor(...registries: HookCallbackRegistry<H>[]) {
    this.registries = registries;
  }

  readonly register: Register<H> = <N extends HookName<H>>(
    name: N,
    callback: HookCallback<H, N>,
  ): Unregister => {
    const registry = this.registries[this.registries.length - 1];
    return registry.register(name, callback);
  };

  readonly trigger: Trigger<H> = <N extends HookName<H>>(
    name: N,
    payload: HookPayload<H, N>,
  ) => {
    this.registries.forEach((registry) => registry.trigger(name, payload));
  };
}
