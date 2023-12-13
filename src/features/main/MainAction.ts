import { Action } from "@/features/action";
import {
  DefaultSignalController,
  SignalController,
} from "@/features/action/signal";
import assert from "assert";
import "reflect-metadata";
import { container } from "tsyringe";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { SubAction, SubActionFactory } from ".";
import { SingleHookCallbackRegistry } from "../action/hook";
import { DefaultLogger } from "../action/logger";
import { buffer, writeToTerminal } from "../action/logger/writers";

export type MainAction = Action<MainHooks>;

export type MainHooks = {
  init: {};
  ready: { run: () => void; signalController: SignalController };
  running: {};
  succeeded: {};
  failed: { error: unknown };
  canceled: {};
  paused: {};
  resumed: {};
  progress: { type: "max" | "now"; value: number; delta?: true };
};

export const createMainAction =
  (subActionFactory: () => SubAction | Promise<SubAction>): MainAction =>
  async ({ logger, trigger }) => {
    while (true) {
      try {
        // Re-create the signal controller for each loop.
        const signalController = new DefaultSignalController();
        const signal = signalController.signal;

        // Wait for run.
        await new Promise<void>(async (run) =>
          trigger("ready", { run, signalController }),
        );

        // Execute the sub action.
        trigger("running", {});
        const subAction = await subActionFactory();
        await subAction({ logger, trigger, signal });

        // Delay 1 second.
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        trigger("failed", { error });
      }
    }
  };

export type MainControllerState =
  | { name: "init" }
  | {
      name: "ready";
      run: () => void;
      signalController: SignalController;
    }
  | {
      name: "running";
      signalController: SignalController;
      progress: {
        max: number;
        now: number;
      };
    };

export const initializeForm = (form: HTMLFormElement) => {
  const runButton = form.querySelector("button[name='run']");
  assert(runButton instanceof HTMLButtonElement);

  const pauseButton = form.querySelector("button[name='pause']");
  assert(pauseButton instanceof HTMLButtonElement);

  const resumeButton = form.querySelector("button[name='resume']");
  assert(resumeButton instanceof HTMLButtonElement);

  const cancelButton = form.querySelector("button[name='cancel']");
  assert(cancelButton instanceof HTMLButtonElement);

  const clearButton = form.querySelector("button[name='clear']");
  assert(clearButton instanceof HTMLButtonElement);

  const progressDiv = form.querySelector("div.progress");
  assert(progressDiv instanceof HTMLDivElement);

  const progressBarDiv = form.querySelector("div.progress-bar");
  assert(progressBarDiv instanceof HTMLDivElement);

  const terminalDiv = form.querySelector("div.terminal");
  assert(terminalDiv instanceof HTMLDivElement);
  const terminal = new Terminal({
    cols: 40,
    rows: 20,
  });
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(terminalDiv);
  fitAddon.fit();

  const logger = new DefaultLogger(buffer(100, writeToTerminal(terminal)));
  const hooks = new SingleHookCallbackRegistry<MainHooks>();

  let state: MainControllerState = { name: "init" };

  const updateElements = () => {
    runButton.disabled = state.name !== "ready";
    runButton.style.display =
      state.name === "init" || state.name === "ready" ? "inline" : "none";

    pauseButton.style.display =
      state.name === "running" && !state.signalController.signal.paused
        ? "inline"
        : "none";

    resumeButton.style.display =
      state.name === "running" && state.signalController.signal.paused
        ? "inline"
        : "none";

    cancelButton.disabled =
      state.name !== "running" || state.signalController.signal.canceled;
    cancelButton.style.display = state.name === "running" ? "inline" : "none";

    clearButton.disabled = state.name !== "ready";

    progressBarDiv.style.width = `${
      state.name === "running" && state.progress.max > 0
        ? (100 * state.progress.now) / state.progress.max
        : 0
    }%`;
  };

  hooks.register("ready", ({ run, signalController }) => {
    logger.info("Ready");
    state = { name: "ready", run, signalController };
    updateElements();
  });

  hooks.register("succeeded", () => {
    logger.info("Succeeded");
  });

  hooks.register("failed", ({ error }) => {
    logger.error(error);
    logger.info("Failed");
  });

  hooks.register("canceled", ({}) => {
    logger.info("Canceled");
  });

  hooks.register("running", ({}) => {
    logger.info("Running...");
  });

  hooks.register("paused", () => {
    logger.info("Paused");
  });

  hooks.register("resumed", () => {
    logger.info("Resumed");
  });

  hooks.register("progress", ({ type, value, delta }) => {
    assert(state.name === "running");
    switch (type) {
      case "max":
        state.progress.max = delta ? state.progress.max + value : value;
        break;
      case "now":
        state.progress.now = delta ? state.progress.now + value : value;
        break;
    }
    updateElements();
  });

  window.addEventListener("resize", () => {
    fitAddon.fit();
  });

  runButton.addEventListener("click", (e) => {
    e.preventDefault();
    assert(state.name === "ready");
    state.run();
    state = {
      name: "running",
      signalController: state.signalController,
      progress: { max: 0, now: 0 },
    };
    updateElements();
  });

  pauseButton.addEventListener("click", (e) => {
    e.preventDefault();
    assert(state.name === "running");
    state.signalController.pause();
    updateElements();
  });

  resumeButton.addEventListener("click", (e) => {
    e.preventDefault();
    assert(state.name === "running");
    state.signalController.resume();
    updateElements();
  });

  cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    assert(state.name === "running");
    state.signalController.cancel();
    if (state.signalController.signal.paused) {
      state.signalController.resume();
    }
    updateElements();
  });

  clearButton.addEventListener("click", (e) => {
    e.preventDefault();
    terminal.clear();
    updateElements();
  });

  updateElements();

  const subActionFactory = container.resolve<SubActionFactory>(form.name);
  const mainAction = createMainAction(() =>
    subActionFactory({ form, terminal }),
  );
  mainAction({
    logger,
    signal: new DefaultSignalController().signal,
    trigger: hooks.trigger,
  });
};
