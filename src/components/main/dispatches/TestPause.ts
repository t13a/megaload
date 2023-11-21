import {
  Delay,
  EmptyInput,
  Listen,
  Pause,
  PauseSignal,
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

    const p1 = Range({ start: 0, end: 1000 });
    const p2 = Listen();
    const p3 = Delay(1000);
    const p4 = Pause(pauseSignal);

    const p1i = p1({ input, signal, logger });
    const p2i = p2({ input: p1i, signal, logger });
    const p3i = p3({ input: p2i, signal, logger });
    const p4i = p4({ input: p3i, signal, logger });

    await consume(p4i, writer);
  };
