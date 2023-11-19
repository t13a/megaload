import { Logger } from "@/utils/logger";

export type Dipatcher = (context: DispatcherContext) => Promise<void>;

export type DispatcherContext = {
  signal: AbortSignal;
  logger: Logger;
};
