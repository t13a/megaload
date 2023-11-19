import {
  DefaultDispatchFactoryRepository,
  DispatchFormController,
} from "./components/main";
import {
  CountPrimeHardCoded,
  CountPrimeUsingOwnStreamProcessor,
  CountPrimeUsingStreamsAPI,
} from "./components/main/dispatches";
import { CountNumberHardCoded } from "./components/main/dispatches/CountNumberHardCoded";
import { CountNumberUsingBlockingQueue } from "./components/main/dispatches/CountNumberUsingOwnBlockingQueue";

document.addEventListener("DOMContentLoaded", async () => {
  const countPrimePropsForm = getForm("count-prime-props");
  const countPrimeFromInput = getFormItem<HTMLInputElement>(
    countPrimePropsForm,
    "from",
  );
  const countPrimeToInput = getFormItem<HTMLInputElement>(
    countPrimePropsForm,
    "to",
  );
  const countPrimeTimeInput = getFormItem<HTMLInputElement>(
    countPrimePropsForm,
    "time",
  );

  const countNumberPropsForm = getForm("count-number-props");
  const countNumberFromInput = getFormItem<HTMLInputElement>(
    countNumberPropsForm,
    "from",
  );
  const countNumberToInput = getFormItem<HTMLInputElement>(
    countNumberPropsForm,
    "to",
  );

  const repo = new DefaultDispatchFactoryRepository();
  repo.register(CountPrimeHardCoded.name, () =>
    CountPrimeHardCoded(
      {
        from: countPrimeFromInput.valueAsNumber,
        to: countPrimeToInput.valueAsNumber,
      },
      {
        time: countPrimeTimeInput.valueAsNumber,
      },
    ),
  );
  repo.register(CountPrimeUsingStreamsAPI.name, () =>
    CountPrimeUsingStreamsAPI(
      {
        from: countPrimeFromInput.valueAsNumber,
        to: countPrimeToInput.valueAsNumber,
      },
      {
        time: countPrimeTimeInput.valueAsNumber,
      },
    ),
  );
  repo.register(CountPrimeUsingOwnStreamProcessor.name, () =>
    CountPrimeUsingOwnStreamProcessor(
      {
        from: countPrimeFromInput.valueAsNumber,
        to: countPrimeToInput.valueAsNumber,
      },
      {
        time: countPrimeTimeInput.valueAsNumber,
      },
    ),
  );
  repo.register(CountNumberHardCoded.name, () =>
    CountNumberHardCoded({
      from: countNumberFromInput.valueAsNumber,
      to: countNumberToInput.valueAsNumber,
    }),
  );
  repo.register(CountNumberUsingBlockingQueue.name, () =>
    CountNumberUsingBlockingQueue({
      from: countNumberFromInput.valueAsNumber,
      to: countNumberToInput.valueAsNumber,
    }),
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
