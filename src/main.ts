import assert from "assert";
import {
  DispatcherFormController,
  DispatcherRepository,
} from "./components/main";
import {
  CountPrime,
  CountPrimeWithSP,
  CountPrimeWithStreamsAPI,
} from "./components/main/dispatchers";

const params = new URL(window.location.href).searchParams;
const from = Number(params.get("from") || 1);
const to = Number(params.get("to") || 1000);

const propsForm = document.forms.namedItem("props");
assert(propsForm instanceof HTMLFormElement);

const fromInput = propsForm.elements.namedItem("from");
assert(fromInput instanceof HTMLInputElement);
fromInput.valueAsNumber = from;

const toInput = propsForm.elements.namedItem("to");
assert(toInput instanceof HTMLInputElement);
toInput.valueAsNumber = to;

const repo = new DispatcherRepository();
repo.register(CountPrime.name, CountPrime({ from, to }));
repo.register(
  CountPrimeWithStreamsAPI.name,
  CountPrimeWithStreamsAPI({ from, to }),
);
repo.register(CountPrimeWithSP.name, CountPrimeWithSP({ from, to }));

document.addEventListener("DOMContentLoaded", async () => {
  for (const form of document.querySelectorAll<HTMLFormElement>(
    "form.dispatcher",
  )) {
    console.info(`loading controller: ${form.name}`);
    new DispatcherFormController(form, repo.resolve(form.name));
  }
});
