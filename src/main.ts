import {
  DefaultDispatchFactoryRepository,
  DispatchFormController,
} from "./components/main";
import {
  CountNumberHardCoded,
  CountNumberUsingBlockingQueue,
  CountPrimeHardCoded,
  CountPrimeUsingOwnStreamProcessor,
  CountPrimeUsingStreamsAPI,
  OpenFileDirectly,
} from "./components/main/dispatches";
import { TestPause } from "./components/main/dispatches/TestPause";
import { PauseController } from "./features/sp";

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

  let fileHandle: FileSystemFileHandle | undefined = undefined;
  const openFilePropsForm = getForm("open-file-props");
  const fileInput = getFormItem<HTMLInputElement>(openFilePropsForm, "file");
  const openFileButton = getFormItem<HTMLButtonElement>(
    openFilePropsForm,
    "open-file",
  );
  openFileButton.addEventListener("click", async (e) => {
    e.preventDefault();
    fileHandle = (await window.showOpenFilePicker())[0];
    fileInput.value = fileHandle.name;
  });

  const pauseController = new PauseController();
  const testPauseForm = getForm("TestPause");
  const pauseButton = getFormItem<HTMLButtonElement>(testPauseForm, "pause");
  pauseButton.addEventListener("click", (e) => {
    e.preventDefault();
    pauseController.pause();
  });
  const resumeButton = getFormItem<HTMLButtonElement>(testPauseForm, "resume");
  resumeButton.addEventListener("click", (e) => {
    e.preventDefault();
    pauseController.resume();
  });

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
  repo.register(OpenFileDirectly.name, () => {
    if (!fileHandle) {
      window.alert("File is not opened");
      throw new Error("File is not opened");
    }
    return OpenFileDirectly({ fileHandle });
  });
  repo.register(TestPause.name, () => {
    return TestPause(pauseController.signal);
  });

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
