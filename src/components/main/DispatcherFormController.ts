import { DefaultLogger } from "@/utils/logger";
import { DispatcherFactory } from ".";

export class DispatcherFormController {
  private form;
  private runButton;
  private abortButton;
  private clearButton;
  private outputTextArea;
  private dispatcherFactory;
  private logger;
  private abortController?: AbortController;
  private outputBuffer: string[] = [];
  private outputBufferSize = 1000;

  constructor(form: HTMLFormElement, dispatcherFactory: DispatcherFactory) {
    this.form = form;
    this.runButton = this.getItem<HTMLButtonElement>("run");
    this.abortButton = this.getItem<HTMLButtonElement>("abort");
    this.clearButton = this.getItem<HTMLButtonElement>("clear");
    this.outputTextArea = this.getItem<HTMLTextAreaElement>("output");
    this.dispatcherFactory = dispatcherFactory;

    this.logger = DefaultLogger.of(this.form.name, (...data) => {
      setTimeout(() => {
        this.writeOutput(...data);
        this.updateElements();
      });
    });

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
        await this.dispatcherFactory()({ signal, logger });
      } catch (error) {
        console.error(error);
        this.writeOutput(error);
        this.writeOutput("Failed to run");
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
