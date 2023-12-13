import assert from "assert";
import "reflect-metadata";
import { container } from "tsyringe";
import { Main, MainController } from "./features/main";
import {
  PerformLogToConsole,
  PerformLogToFile,
  PerformLogToTerminal,
  Stub,
} from "./features/main/sub-actions";
import "./main.scss";

container.register("Stub", { useClass: Stub });
container.register("PerformLogToConsole", { useClass: PerformLogToConsole });
container.register("PerformLogToTerminal", { useClass: PerformLogToTerminal });
container.register("PerformLogToFile", { useClass: PerformLogToFile });

document.addEventListener("DOMContentLoaded", () => {
  for (const form of document.querySelectorAll("form.action")) {
    assert(form instanceof HTMLFormElement);

    console.debug(`Initializing form ${form.name}`);

    const childContainer = container.createChildContainer();
    childContainer.register(HTMLFormElement, { useValue: form });

    const mainController = new MainController();
    mainController.init(childContainer);

    const mainAction = new Main().create(childContainer);
    mainController.start(mainAction);
  }
});
