import {
  DefaultDispatchFactoryRepository,
  DispatchFormController,
} from "./components/main";
import {
  CountPrimeHardCoded,
  CountPrimeUsingOwnStreamProcessor,
  CountPrimeUsingStreamsAPI,
} from "./components/main/dispatches";

document.addEventListener("DOMContentLoaded", async () => {
  const delayPropsForm = getForm("delay-props");
  const timeInput = getFormItem<HTMLInputElement>(delayPropsForm, "time");

  const countPropsForm = getForm("count-props");
  const fromInput = getFormItem<HTMLInputElement>(countPropsForm, "from");
  const toInput = getFormItem<HTMLInputElement>(countPropsForm, "to");

  const repo = new DefaultDispatchFactoryRepository();
  repo.register(CountPrimeHardCoded.name, () =>
    CountPrimeHardCoded(
      {
        from: fromInput.valueAsNumber,
        to: toInput.valueAsNumber,
      },
      {
        time: timeInput.valueAsNumber,
      },
    ),
  );
  repo.register(CountPrimeUsingStreamsAPI.name, () =>
    CountPrimeUsingStreamsAPI(
      {
        from: fromInput.valueAsNumber,
        to: toInput.valueAsNumber,
      },
      {
        time: timeInput.valueAsNumber,
      },
    ),
  );
  repo.register(CountPrimeUsingOwnStreamProcessor.name, () =>
    CountPrimeUsingOwnStreamProcessor(
      {
        from: fromInput.valueAsNumber,
        to: toInput.valueAsNumber,
      },
      {
        time: timeInput.valueAsNumber,
      },
    ),
  );

  for (const dispatchForm of document.querySelectorAll<HTMLFormElement>(
    "form.dispatch",
  )) {
    const runButton = getFormItem<HTMLButtonElement>(dispatchForm, "run");
    const abortButton = getFormItem<HTMLButtonElement>(dispatchForm, "abort");
    const clearButton = getFormItem<HTMLButtonElement>(dispatchForm, "clear");
    const outputTextArea = getFormItem<HTMLTextAreaElement>(
      dispatchForm,
      "output",
    );
    const dispatchFactory = repo.resolve(dispatchForm.name);

    new DispatchFormController({
      elements: {
        runButton,
        abortButton,
        clearButton,
        outputTextArea,
      },
      dispatchFactory,
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
