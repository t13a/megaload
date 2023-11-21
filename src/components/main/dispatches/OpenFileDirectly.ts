import { FileProps, formatNumber } from ".";
import { Dipatch } from "../Dispatch";

export const OpenFileDirectly =
  ({ fileHandle }: FileProps): Dipatch =>
  async ({ writer }) => {
    const beginAt = new Date().getTime();

    const file = await fileHandle.getFile();
    const size = file.size;
    const type = file.type;
    const text = await file.text();

    const endAt = new Date().getTime();
    const ms = endAt - beginAt;

    writer(text);
    writer();
    writer(`type = ${type}`);
    writer(`size = ${formatNumber(size)} bytes`);
    writer(`ms = ${formatNumber(ms)}`);
  };
