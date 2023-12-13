import { Action } from "@/features/action";
import { Terminal } from "xterm";
import { MainHooks } from ".";

export type SubHooks = {
  [T in "succeeded" | "canceled" | "progress"]: MainHooks[T];
};

export type SubAction = Action<SubHooks>;

export type SubActionFactory = (
  context: SubActionFactoryContext,
) => SubAction | Promise<SubAction>;

export type SubActionFactoryContext = {
  form: HTMLFormElement;
  terminal: Terminal;
};
