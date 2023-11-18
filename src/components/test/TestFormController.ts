import { DefaultLogger, toDefaultLoggerWriters } from "@/utils";
import { TestDipatcher } from "./TestDispatcher";

export class TestFormController {
  private form;
  private runButton;
  private abortButton;
  private clearButton;
  private outputTextArea;
  private dispatcher;
  private logger;
  private abortController?: AbortController;
  private outputBuffer: string[] = [];
  private outputBufferSize = 1000;

  constructor(form: HTMLFormElement, dispatcher: TestDipatcher) {
    this.form = form;
    this.runButton = this.getItem<HTMLButtonElement>("run");
    this.abortButton = this.getItem<HTMLButtonElement>("abort");
    this.clearButton = this.getItem<HTMLButtonElement>("clear");
    this.outputTextArea = this.getItem<HTMLTextAreaElement>("output");
    this.dispatcher = dispatcher;

    this.logger = new DefaultLogger(
      this.form.name,
      toDefaultLoggerWriters((...data) => this.writeOutput(...data)),
    );

    this.runButton.addEventListener("click", (e) =>
      this.handleRunButtonClick(e),
    );
    this.abortButton.addEventListener("click", (e) =>
      this.handleAbortButtonClick(e),
    );
    this.clearButton.addEventListener("click", (e) =>
      this.handleClearButtonClick(e),
    );

    this.updateElements();
  }

  private getItem = <T extends Element>(name: string) => {
    const element = this.form.elements.namedItem(name);

    if (!(element instanceof Element)) {
      throw new Error(
        `item ${name} in form ${this.form.name} is not an element`,
      );
    }

    return element as T;
  };

  private async handleRunButtonClick(e: Event) {
    e.preventDefault();

    if (this.abortController) {
      throw new Error("Already running");
    }

    this.abortController = new AbortController();
    this.updateElements();

    const signal = this.abortController.signal;
    const logger = this.logger.create();
    new Promise(async () => {
      try {
        await this.dispatcher({ signal, logger });
      } catch (error) {
        this.writeOutput(error);
      }

      this.abortController = undefined;
      this.updateElements();
    });
  }

  private async handleAbortButtonClick(e: Event) {
    e.preventDefault();

    if (!this.abortController) {
      throw new Error("Not running");
    }

    this.abortController.abort();
    this.updateElements();
  }

  private async handleClearButtonClick(e: Event) {
    e.preventDefault();

    this.clearOutput();
    this.updateElements();
  }

  private writeOutput(...data: any[]): void {
    if (this.outputBuffer.length === this.outputBufferSize) {
      this.outputBuffer.shift();
    }

    this.outputBuffer.push(data.join(" "));

    this.outputTextArea.value = this.outputBuffer.join("\n");
    this.outputTextArea.scrollTop = this.outputTextArea.scrollHeight;
  }

  private clearOutput(): void {
    this.outputBuffer = [];
    this.outputTextArea.value = "";
  }

  private updateElements(): void {
    const isRunning = !!this.abortController;
    const isAborting = !!this.abortController?.signal.aborted;
    const isClear = this.outputTextArea.value === "";

    this.runButton.disabled = isRunning;
    this.abortButton.disabled = !isRunning || isAborting;
    this.clearButton.disabled = isRunning || isClear;

    if (!isRunning && isClear) {
      this.outputTextArea.classList.add("hidden");
    } else {
      this.outputTextArea.classList.remove("hidden");
    }
  }
}
