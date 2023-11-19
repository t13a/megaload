import { Logger } from "@/utils/logger";

export type TestDipatcher = (context: TestDispatcherContext) => Promise<void>;

export type TestDispatcherContext = {
  signal: AbortSignal;
  logger: Logger;
};
