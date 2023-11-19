import assert from "assert";
import {
  DefaultDispatcherFactoryRepository,
  DispatcherFormController,
} from "./components/main";
import {
  CountPrime,
  CountPrimeWithSP,
  CountPrimeWithStreamsAPI,
} from "./components/main/dispatchers";

const propsForm = document.forms.namedItem("props");
assert(propsForm instanceof HTMLFormElement);

const fromInput = propsForm.elements.namedItem("from");
assert(fromInput instanceof HTMLInputElement);

const toInput = propsForm.elements.namedItem("to");
assert(toInput instanceof HTMLInputElement);

const repo = new DefaultDispatcherFactoryRepository();
repo.register(CountPrime.name, () =>
  CountPrime({
    from: fromInput.valueAsNumber,
    to: toInput.valueAsNumber,
  }),
);
repo.register(CountPrimeWithStreamsAPI.name, () =>
  CountPrimeWithStreamsAPI({
    from: fromInput.valueAsNumber,
    to: toInput.valueAsNumber,
  }),
);
repo.register(CountPrimeWithSP.name, () =>
  CountPrimeWithSP({
    from: fromInput.valueAsNumber,
    to: toInput.valueAsNumber,
  }),
);

document.addEventListener("DOMContentLoaded", async () => {
  for (const form of document.querySelectorAll<HTMLFormElement>(
    "form.dispatcher",
  )) {
    console.info(`loading controller: ${form.name}`);
    new DispatcherFormController(form, repo.resolve(form.name));
  }
});
