import { DefaultLoadGeneratorFactory } from "../../features/load/DefaultGeneratorFactory";
import { LoadGenerator } from "../../features/load/LoadGenerator";
import { CountPrime } from "../../features/load/generators/CountPrime";
import { ParseFile } from "../../features/load/generators/ParseFile";
import { ReadFromAsyncIterable } from "../../utils/stream/readable/ReadFromAsyncIterable";
import { WriteToCallback } from "../../utils/stream/writable/WriteToCallback";
import { WriteToTextArea } from "../../utils/stream/writable/WriteToTextArea";
import { timeout } from "../../utils/timeout";

type MainControllerOptions = {
  elements: {
    countPrimeInput: HTMLInputElement;
    fromInput: HTMLInputElement;
    toInput: HTMLInputElement;
    parseFileInput: HTMLInputElement;
    fileInput: HTMLInputElement;
    runButton: HTMLButtonElement;
    cancelButton: HTMLButtonElement;
    outputTextArea: HTMLTextAreaElement;
    clearButton: HTMLButtonElement;
  };
};

export class MainController {
  private options;
  private generatorFactory;
  private running: boolean = false;
  private canceling: boolean = false;
  private abortController?: AbortController;

  constructor(options: MainControllerOptions) {
    this.options = options;

    const generatorFactories = {
      "count-prime": () =>
        new CountPrime({
          from: this.options.elements.fromInput.valueAsNumber,
          to: this.options.elements.toInput.valueAsNumber,
        }),
      "parse-file": () =>
        new ParseFile({
          file: this.options.elements.fileInput.files![0],
        }),
    };
    this.generatorFactory = new DefaultLoadGeneratorFactory<
      keyof typeof generatorFactories
    >({ generatorFactories });

    this.options.elements.countPrimeInput.addEventListener("change", (e) =>
      this.handleCountPrimeInputChange(e),
    );
    this.options.elements.parseFileInput.addEventListener("change", (e) =>
      this.handleParseFileInputChange(e),
    );
    this.options.elements.fileInput.addEventListener("change", (e) =>
      this.handleFileInputChange(e),
    );
    this.options.elements.runButton.addEventListener("click", (e) =>
      this.handleRunButtonClick(e),
    );
    this.options.elements.cancelButton.addEventListener("click", (e) =>
      this.handleCancelButtonClick(e),
    );
    this.options.elements.clearButton.addEventListener("click", (e) =>
      this.handleClearButtonClick(e),
    );

    this.updateElements();
  }

  private async handleCountPrimeInputChange(e: Event) {
    this.updateElements();
  }

  private async handleParseFileInputChange(e: Event) {
    this.updateElements();
  }

  private async handleFileInputChange(e: Event) {
    this.updateElements();
  }

  private async handleRunButtonClick(e: Event) {
    e.preventDefault();

    this.running = true;
    this.updateElements();

    timeout(0, () => this.run()); // No await.
  }

  private async handleCancelButtonClick(e: Event) {
    e.preventDefault();

    this.canceling = true;
    this.updateElements();

    timeout(0, () => this.cancel()); // No await.
  }

  private async handleClearButtonClick(e: Event) {
    e.preventDefault();

    this.options.elements.outputTextArea.value = "";
  }

  private updateElements() {
    const isRunning = this.running;
    const isCanceling = this.canceling;
    const isCountPrimeSelected = this.options.elements.countPrimeInput.checked;
    const isParseFileSelected = this.options.elements.parseFileInput.checked;
    const isFileSelected =
      this.options.elements.fileInput.files &&
      this.options.elements.fileInput.files.length == 1;
    const isReady =
      !isRunning &&
      (isCountPrimeSelected || (isParseFileSelected && isFileSelected));

    this.options.elements.countPrimeInput.disabled = isRunning;
    this.options.elements.fromInput.disabled =
      isRunning || !isCountPrimeSelected;
    this.options.elements.toInput.disabled = isRunning || !isCountPrimeSelected;
    this.options.elements.parseFileInput.disabled = isRunning;
    this.options.elements.fileInput.disabled =
      isRunning || !isParseFileSelected;
    this.options.elements.runButton.disabled = isRunning || !isReady;
    this.options.elements.cancelButton.disabled = !isRunning || isCanceling;
    this.options.elements.clearButton.disabled = isRunning;
  }

  private createGenerator(): LoadGenerator {
    if (this.options.elements.countPrimeInput.checked) {
      return this.generatorFactory.create("count-prime");
    } else if (this.options.elements.parseFileInput.checked) {
      return this.generatorFactory.create("parse-file");
    } else {
      throw new Error("Failed to create generator");
    }
  }

  private async run(): Promise<void> {
    console.debug("MainController.run", "begin");

    if (this.abortController) {
      return;
    }

    const readFromGenerator = ReadFromAsyncIterable<string>(
      this.createGenerator().generate(),
    );
    const writeToOutput = WriteToTextArea({
      element: this.options.elements.outputTextArea,
    });
    const writeToConsole = WriteToCallback(console.info);
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      const [r1, r2] = readFromGenerator.tee();
      await Promise.all([
        r1.pipeTo(writeToOutput, { signal }),
        r2.pipeTo(writeToConsole, { signal }),
      ]);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.debug("MainController.run", "aborted");
      } else {
        throw error;
      }
    }

    this.abortController = undefined;

    this.running = false;
    this.canceling = false;
    this.updateElements();

    console.debug("MainController.run", "end");
  }

  private async cancel(): Promise<void> {
    console.debug("MainController.cancel", "begin");

    if (!this.abortController) {
      return;
    }

    this.abortController.abort(); // TODO: Cancel gracefully.

    this.running = false;
    this.canceling = false;
    this.updateElements();

    console.debug("MainController.cancel", "end");
  }
}
