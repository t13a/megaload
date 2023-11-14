export type TransformByCallbackProps<I, O> = (chunk: I) => O | PromiseLike<O>;

export const TransformByCallback = <I, O>(
  callback: TransformByCallbackProps<I, O>,
) => {
  return new TransformStream<I, O>({
    async transform(chunk, controller) {
      try {
        controller.enqueue(await callback(chunk));
      } catch (error) {
        controller.error(error);
      }
    },
  });
};
