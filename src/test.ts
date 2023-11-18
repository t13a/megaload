import {
  TestDispatcherRepository,
  TestFormController,
} from "./components/test";
import { Count } from "./components/test/dispatchers";

const repo = new TestDispatcherRepository();
repo.register(
  "CountVerbose",
  Count({ from: 1, to: 1000, verbosity: "verbose" }),
);
repo.register("CountQuiet", Count({ from: 1, to: 1000, verbosity: "quiet" }));

document.addEventListener("DOMContentLoaded", async () => {
  for (const form of document.forms) {
    console.info(`loading controller: ${form.name}`);
    new TestFormController(form, repo.resolve(form.name));
  }
});
