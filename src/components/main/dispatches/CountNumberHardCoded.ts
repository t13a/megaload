import { CountProps, formatNumber } from ".";
import { Dipatch } from "../Dispatch";

export const CountNumberHardCoded =
  ({ from, to }: CountProps): Dipatch =>
  async ({ writer }) => {
    let count = 0;

    const beginAt = new Date().getTime();

    for (let n = from; n <= to; n++) {
      count++;
    }

    const endAt = new Date().getTime();

    writer(`count = ${formatNumber(count)}`);

    const ms = endAt - beginAt;
    const iops = count / ((endAt - beginAt) / 1000);
    writer(`ms = ${formatNumber(ms)}`);
    writer(`iops = ${formatNumber(iops)}`);
  };
