import { Logger } from "@/utils/logger";

export type StreamProcessor<I, O> = (
  context: StreamProcessorContext<I>,
) => AsyncIterable<O>;

export type StreamProcessorContext<I> = {
  readonly input: AsyncIterable<I>;
  readonly signal: AbortSignal;
  readonly logger: Logger;
};
