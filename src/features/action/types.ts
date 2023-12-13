import { Hooks, Trigger } from "./hook";
import { Logger } from "./logger";
import { Signal } from "./signal";

export type Action<H extends Hooks, T = void> = (
  context: ActionContext<H>,
) => Promise<T>;

export type ActionContext<H extends Hooks> = {
  readonly logger: Logger;
  readonly signal: Signal;
  readonly trigger: Trigger<H>;
};
