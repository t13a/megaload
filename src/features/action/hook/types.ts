export type Hooks = { [N in string]: any };

export type HookName<H extends Hooks> = keyof H & string;

export type HookPayload<H extends Hooks, N extends HookName<H>> = H[N];

export type HookCallback<H extends Hooks, N extends HookName<H>> = (
  payload: HookPayload<H, N>,
) => void;

export type HookCallbackRegistry<H extends Hooks> = {
  // XXX
  // register: Register<H>;
  register<N extends HookName<H>>(
    name: N,
    callback: HookCallback<H, N>,
  ): Unregister;

  // XXX
  // trigger: Trigger<H>;
  trigger<N extends HookName<H>>(name: N, payload: HookPayload<H, N>): void;
};

// XXX
// export type Register<H extends Hooks> = <N extends HookName<H>>(
//   name: N,
//   callback: HookCallback<H, N>,
// ) => Unregister;
export type Register<H extends Hooks> = HookCallbackRegistry<H>["register"];
export type Unregister = () => void;

// XXX
// export type Trigger<H extends Hooks> = <N extends HookName<H>>(
//   name: N,
//   payload: HookPayload<H, N>,
// ) => void;
export type Trigger<H extends Hooks> = HookCallbackRegistry<H>["trigger"];
