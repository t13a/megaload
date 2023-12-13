import { HookName, HookPayload, Hooks, Trigger } from ".";

export type WithPrefix<P extends string, H extends Hooks> = {
  [N in HookName<H> as `${P}${N}`]: H[N];
};

export const extractTrigger = <P extends string, H extends Hooks>(
  prefix: P,
  trigger: Trigger<WithPrefix<P, H>>,
): Trigger<H> => {
  return (name: HookName<H>, payload: HookPayload<H, HookName<H>>) => {
    trigger(`${prefix}${name}`, payload);
  };
};

export const createTriggerWithPrefix = <P extends string, H extends Hooks>(
  prefix: P,
  trigger: Trigger<H>,
): Trigger<Trigger<WithPrefix<P, H>>> => {
  return (
    name: HookName<WithPrefix<P, H>>,
    payload: HookPayload<WithPrefix<P, H>, HookName<WithPrefix<P, H>>>,
  ) => {
    trigger(name.substring(prefix.length), payload as any);
  };
};
