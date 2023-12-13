import { ActionContext } from ".";
import { HookName, HookPayload, Hooks } from "./hook";

export type Callback<T = void> = (value: T) => void;

export type WaitForCallbackResult<T = void> =
  | { type: "resolved"; value: T }
  | { type: "rejected"; error: unknown }
  | { type: "canceled" };

export const waitForCallback = <T, H extends Hooks, N extends HookName<H>>(
  context: Omit<ActionContext<H>, "logger">,
  name: N,
  payloadFactory: (resolve: Callback<T>) => HookPayload<H, N>,
): Promise<WaitForCallbackResult<T>> => {
  return new Promise<WaitForCallbackResult<T>>(async (result) => {
    const canceled = () => result({ type: "canceled" });
    const unregister = context.signal.register("cancel", canceled);

    const resolved = (value: T) => {
      unregister();
      result({ type: "resolved", value });
    };

    const rejected = (error: unknown) => {
      unregister();
      result({ type: "rejected", error });
    };

    try {
      context.trigger(name, payloadFactory(resolved));
    } catch (error) {
      rejected(error);
    }
  });
};

type MaybeVoid<T> = T extends unknown ? void : T;
