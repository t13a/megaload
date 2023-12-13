import { SubActionFactory, initializeForm } from "@/features/main";
import {
  PerformLogToConsole,
  PerformLogToFile,
  PerformLogToTerminal,
  Stub,
} from "@/features/main/sub-actions";
import assert from "assert";
import "reflect-metadata";
import { container } from "tsyringe";
import "./main.scss";

container.register<SubActionFactory>("Stub", {
  useValue: Stub,
});
container.register<SubActionFactory>("PerformLogToConsole", {
  useValue: PerformLogToConsole,
});
container.register<SubActionFactory>("PerformLogToTerminal", {
  useValue: PerformLogToTerminal,
});
container.register<SubActionFactory>("PerformLogToFile", {
  useValue: PerformLogToFile,
});

document.addEventListener("DOMContentLoaded", () => {
  for (const form of document.querySelectorAll("form.action")) {
    assert(form instanceof HTMLFormElement);
    console.debug(`Initializing form: ${form.name}`);
    initializeForm(form);
  }
});
