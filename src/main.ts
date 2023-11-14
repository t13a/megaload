import assert from "assert";
import { MainController } from "./components/main/MainController";

document.addEventListener("DOMContentLoaded", async () => {
  const countPrimeInput = document.querySelector("#count-prime");
  const fromInput = document.querySelector("#from");
  const toInput = document.querySelector("#to");
  assert(countPrimeInput instanceof HTMLInputElement);
  assert(fromInput instanceof HTMLInputElement);
  assert(toInput instanceof HTMLInputElement);

  const parseFileInput = document.querySelector("#parse-file");
  const fileInput = document.querySelector("#file");
  assert(parseFileInput instanceof HTMLInputElement);
  assert(fileInput instanceof HTMLInputElement);

  const runButton = document.querySelector("#run");
  const cancelButton = document.querySelector("#cancel");
  const outputTextArea = document.querySelector("#output");
  const clearButton = document.querySelector("#clear");
  assert(runButton instanceof HTMLButtonElement);
  assert(cancelButton instanceof HTMLButtonElement);
  assert(outputTextArea instanceof HTMLTextAreaElement);
  assert(clearButton instanceof HTMLButtonElement);

  new MainController({
    elements: {
      countPrimeInput,
      fromInput,
      toInput,
      parseFileInput,
      fileInput,
      runButton,
      cancelButton,
      outputTextArea,
      clearButton,
    },
  });
});
