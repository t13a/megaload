import assert from "assert";
import { DependencyContainer } from "tsyringe";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { MainAction, MainHooks } from ".";
import { SingleHookCallbackRegistry, Trigger } from "../action/hook";
import { DefaultLogger, Logger } from "../action/logger";
import { buffer, writeToTerminal } from "../action/logger/writers";
import { DefaultSignalController, SignalController } from "../action/signal";

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

export class MainController {
  private logger: Logger | undefined;
  private trigger: Trigger<MainHooks> | undefined;

  init(childContainer: DependencyContainer) {
    const form = childContainer.resolve(HTMLFormElement);

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

    childContainer.register(Terminal, { useValue: terminal });

    const logger = new DefaultLogger(buffer(100, writeToTerminal(terminal)));
    const registry = new SingleHookCallbackRegistry<MainHooks>();

    this.logger = logger;
    this.trigger = registry.trigger;

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

    registry.register("wait-for-run", ({ run, signalController }) => {
      state = { name: "ready", run, signalController };
      updateElements();
      logger.info("Ready");
    });

    registry.register("succeeded", () => {
      logger.info("Succeeded");
    });

    registry.register("failed", ({ error }) => {
      logger.error(error);
      logger.info("Failed");
    });

    registry.register("canceled", ({}) => {
      logger.info("Canceled");
    });

    registry.register("running", ({}) => {
      logger.info("Running...");
    });

    registry.register("progress", ({ type, value, delta }) => {
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

      // Invoke in the next event loop.
      const run = state.run;
      setTimeout(() => run());

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
  }

  start(mainAction: MainAction) {
    assert(this.logger);
    assert(this.trigger);
    mainAction({
      logger: this.logger,
      signal: new DefaultSignalController().signal,
      trigger: this.trigger,
    });
  }
}
