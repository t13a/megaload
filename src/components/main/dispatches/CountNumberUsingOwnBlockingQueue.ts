import { consume } from "@/utils";
import { DefaultBlockingQueue } from "@/utils/queue";
import { CountProps, format } from ".";
import { Dipatch } from "../Dispatch";

export const CountNumberUsingBlockingQueue =
  ({ from, to }: CountProps): Dipatch =>
  async ({ writer }) => {
    let count = 0;

    const beginAt = new Date().getTime();

    const queue = new DefaultBlockingQueue();
    const producer = async function* () {
      for (let n = from; n <= to; n++) {
        yield n;
      }
    };
    await Promise.all([
      queue.enqueueAll(producer()),
      consume(queue, () => count++),
    ]);

    const endAt = new Date().getTime();

    writer(`count = ${format(count)}`);

    const ms = endAt - beginAt;
    const iops = count / ((endAt - beginAt) / 1000);
    writer(`ms = ${format(ms)}`);
    writer(`iops = ${format(iops)}`);
  };
