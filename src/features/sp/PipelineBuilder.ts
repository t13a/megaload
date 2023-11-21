import { StreamProcessor, StreamProcessorContext } from ".";

export class PipelineBuilder<I> {
  private context;

  constructor(context: StreamProcessorContext<I>) {
    this.context = context;
  }

  build(): AsyncIterable<I> {
    return this.context.input;
  }

  through<O>(processor: StreamProcessor<I, O>): PipelineBuilder<O> {
    return new PipelineBuilder({
      input: processor({
        input: this.context.input,
        signal: this.context.signal,
        logger: this.context.logger,
      }),
      signal: this.context.signal,
      logger: this.context.logger,
    });
  }
}
