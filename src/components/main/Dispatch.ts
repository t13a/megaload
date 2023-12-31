import { Writer } from "@/utils/logger";

export type Dipatch = (context: DispatchContext) => Promise<void>;

export type DispatchContext = {
  signal: AbortSignal;
  writer: Writer;
};
