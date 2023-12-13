import { BufferedWriter, Log } from "..";

export const writeToFile = (
  fileHandle: FileSystemFileHandle,
): BufferedWriter => {
  const buffer: any[] = [];
  let busy = false;

  const write = async () => {
    do {
      const writable = await fileHandle.createWritable({
        keepExistingData: true,
      });
      await writable.seek((await fileHandle.getFile()).size);

      const data = `${buffer.join("\n")}\n`;
      buffer.length = 0;

      await writable.write(data);
      await writable.close();
    } while (buffer.length > 0);
  };

  return (logs: readonly Log[]) => {
    logs.forEach((log) => buffer.push(log.data));
    if (!busy) {
      busy = true;
      write().then(() => {
        busy = false;
      });
    }
  };
};
