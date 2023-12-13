import { Action, Callback, waitForCallback } from "@/features/action";
import {
  DefaultSignalController,
  SignalController,
} from "@/features/action/signal";
import "reflect-metadata";
import { DependencyContainer } from "tsyringe";

export type MainAction = Action<MainHooks>;

export type SubAction = Action<SubHooks>;

export type MainHooks = {
  init: {};
  "wait-for-run": { run: Callback; signalController: SignalController };
  running: {};
  succeeded: {};
  failed: { error: unknown };
  canceled: {};
  progress: { type: "max" | "now"; value: number; delta?: true };
};

export type SubHooks = {
  [T in "succeeded" | "failed" | "canceled" | "progress"]: MainHooks[T];
};

export type MainActionFactory = {
  create(childContainer: DependencyContainer): MainAction;
};

export type SubActionFactory = {
  create(childContainer: DependencyContainer): SubAction;
};

export class Main implements MainActionFactory {
  create(childContainer: DependencyContainer): MainAction {
    // Create sub action by form name.
    const form = childContainer.resolve(HTMLFormElement);
    const subActionFactory = childContainer.resolve<SubActionFactory>(
      form.name,
    );
    const subAction = subActionFactory.create(childContainer);

    // Create main action.
    return async ({ logger, trigger }) => {
      while (true) {
        try {
          // Recreate the signal controller for each loop (do not use context signal).
          const signalController = new DefaultSignalController();
          const signal = signalController.signal;

          // Wait for run.
          const waitForRunResult = await waitForCallback(
            { signal, trigger },
            "wait-for-run",
            (run) => {
              return { run, signalController };
            },
          );
          if (waitForRunResult.type === "canceled") {
            trigger("canceled", {});
            continue;
          } else if (waitForRunResult.type === "rejected") {
            trigger("failed", { error: waitForRunResult.error });
            continue;
          }

          // Run sub action.
          trigger("running", {});
          await subAction({ logger, signal, trigger });
        } catch (error) {
          trigger("failed", { error });
        }

        // Delay 1 second intentionally.
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };
  }
}
