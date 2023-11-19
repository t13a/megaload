export type WriteToCallbackProps<W> = (chunk: W) => any | PromiseLike<any>;

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
