import {
  DefaultDispatcherFactoryRepository,
  DispatcherFormController,
} from "./components/main";
import {
  CountPrime,
  CountPrimeWithSP,
  CountPrimeWithStreamsAPI,
} from "./components/main/dispatchers";

document.addEventListener("DOMContentLoaded", async () => {
  const delayPropsForm = getForm("delay-props");
  const timeInput = getFormItem<HTMLInputElement>(delayPropsForm, "time");

  const countPropsForm = getForm("count-props");
  const fromInput = getFormItem<HTMLInputElement>(countPropsForm, "from");
  const toInput = getFormItem<HTMLInputElement>(countPropsForm, "to");

  const repo = new DefaultDispatcherFactoryRepository();
  repo.register(CountPrime.name, () =>
    CountPrime(
      {
        from: fromInput.valueAsNumber,
        to: toInput.valueAsNumber,
      },
      {
        time: timeInput.valueAsNumber,
      },
    ),
  );
  repo.register(CountPrimeWithStreamsAPI.name, () =>
    CountPrimeWithStreamsAPI(
      {
        from: fromInput.valueAsNumber,
        to: toInput.valueAsNumber,
      },
      {
        time: timeInput.valueAsNumber,
      },
    ),
  );
  repo.register(CountPrimeWithSP.name, () =>
    CountPrimeWithSP(
      {
        from: fromInput.valueAsNumber,
        to: toInput.valueAsNumber,
      },
      {
        time: timeInput.valueAsNumber,
      },
    ),
  );

  for (const dispatcherForm of document.querySelectorAll<HTMLFormElement>(
    "form.dispatcher",
  )) {
    const runButton = getFormItem<HTMLButtonElement>(dispatcherForm, "run");
    const abortButton = getFormItem<HTMLButtonElement>(dispatcherForm, "abort");
    const clearButton = getFormItem<HTMLButtonElement>(dispatcherForm, "clear");
    const outputTextArea = getFormItem<HTMLTextAreaElement>(
      dispatcherForm,
      "output",
    );
    const dispatcherFactory = repo.resolve(dispatcherForm.name);

    new DispatcherFormController({
      elements: {
        runButton,
        abortButton,
        clearButton,
        outputTextArea,
      },
      dispatcherFactory,
    });
  }
});

const getForm = (name: string) => {
  const form = document.forms.namedItem(name);

  if (!form) {
    throw new Error(`form ${name} not found`);
  }

  return form;
};

const getFormItem = <T extends Element>(
  form: HTMLFormElement,
  name: string,
) => {
  const element = form.elements.namedItem(name);

  if (!(element instanceof Element)) {
    throw new Error(`item ${name} in form ${form.name} is not an element`);
  }

  return element as T;
};
