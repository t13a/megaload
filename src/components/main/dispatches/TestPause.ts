import {
  Async,
  Delay,
  EmptyInput,
  Pause,
  PauseSignal,
  PipelineBuilder,
  Range,
} from "@/features/sp";
import { consume } from "@/utils";
import { DefaultLogger } from "@/utils/logger";
import { Dipatch } from "../Dispatch";

export const TestPause =
  (pauseSignal: PauseSignal): Dipatch =>
  async ({ signal, writer }) => {
    const input = new EmptyInput();
    const logger = DefaultLogger.of(writer);

    const pipeline = new PipelineBuilder({ input, signal, logger })
      .through(Async(Range({ start: 0, end: 1000 })))
      .through(Delay(1000))
      .through(Pause(pauseSignal))
      .build();

    await consume(pipeline, writer);
  };
