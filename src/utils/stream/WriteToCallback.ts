export type WriteToCallbackProps<W> = (chunk: W) => void | PromiseLike<void>;

export const WriteToCallback = <W>(callback: WriteToCallbackProps<W>) => {
  return new WritableStream<W>({
    async write(chunk, controller) {
      try {
        await callback(chunk);
      } catch (error) {
        controller.error(error);
      }
    },
  });
};
