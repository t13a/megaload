export type WriteToTextAreaProps = {
  element: HTMLTextAreaElement;
  clear?: boolean;
  bufferSize?: number;
};

export const WriteToTextArea = <W = any>({
  element,
  clear = true,
  bufferSize = 1000,
}: WriteToTextAreaProps) => {
  const buffer: string[] = [];
  let cleared = false;
  return new WritableStream<W>({
    write(chunk) {
      if (clear && !cleared) {
        element.value = "";
        cleared = true;
      }

      if (buffer.length === bufferSize) {
        buffer.shift();
      }
      buffer.push(typeof chunk === "string" ? chunk : `${chunk}`);
      element.value = buffer.join("\n");
      element.scrollTop = element.scrollHeight;
    },
  });
};
