import { LoggerWriter } from "@/utils/logger";
import { DispatcherFactory } from ".";

export type DispatcherFormControllerOptions = {
  readonly elements: {
    readonly runButton: HTMLButtonElement;
    readonly abortButton: HTMLButtonElement;
    readonly clearButton: HTMLButtonElement;
    readonly outputTextArea: HTMLTextAreaElement;
  };
  readonly dispatcherFactory: DispatcherFactory;
};

export class DispatcherFormController {
  private runButton;
  private abortButton;
  private clearButton;
  private outputTextArea;
  private dispatcherFactory;
  private writer: LoggerWriter;
  private abortController?: AbortController;
  private outputBuffer: string[] = [];
  private outputBufferSize = 1000;

  constructor(options: DispatcherFormControllerOptions) {
    this.runButton = options.elements.runButton;
    this.abortButton = options.elements.abortButton;
    this.clearButton = options.elements.clearButton;
    this.outputTextArea = options.elements.outputTextArea;
    this.dispatcherFactory = options.dispatcherFactory;

    this.writer = (...data) => {
      setTimeout(() => {
        this.writeOutput(...data);
        this.updateElements();
      });
    };

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

  private async handleRunButtonClick(e: Event) {
    e.preventDefault();

    if (this.abortController) {
      throw new Error("Already running");
    }

    this.abortController = new AbortController();
    this.updateElements();

    const signal = this.abortController.signal;
    const writer = this.writer;
    new Promise(async () => {
      try {
        await this.dispatcherFactory()({ signal, writer });
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
