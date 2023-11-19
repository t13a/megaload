import { CountProps, count as countFn, format } from ".";
import { Dipatch } from "../Dispatch";

export const CountNumberHardCoded =
  ({ from, to }: CountProps): Dipatch =>
  async ({ writer }) => {
    let count = 0;

    const beginAt = new Date().getTime();

    for (const n of countFn({ from, to })) {
      count++;
    }

    const endAt = new Date().getTime();

    writer(`count = ${format(count)}`);

    const ms = endAt - beginAt;
    const iops = count / ((endAt - beginAt) / 1000);
    writer(`ms = ${format(ms)}`);
    writer(`iops = ${format(iops)}`);
  };
