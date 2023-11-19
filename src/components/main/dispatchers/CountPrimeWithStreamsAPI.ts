import { CountProps, format, isPrime } from ".";
import { Dipatcher } from "../Dispatcher";

export const CountPrimeWithStreamsAPI =
  ({ from, to }: CountProps): Dipatcher =>
  async ({ signal, ...context }) => {
    let result = 0;

    const beginAt = new Date().getTime();

    const r1 = Count({ from, to });
    const t1 = Filter(isPrime);
    const w1 = Consumer((n: number) => result++);

    await r1.pipeThrough(t1).pipeTo(w1);

    const endAt = new Date().getTime();

    context.logger.info(`result = ${format(result)}`);

    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.logger.info(`n = ${format(n)} (${format(from)}~${format(to)})`);
    context.logger.info(`ms = ${format(ms)}`);
    context.logger.info(`iops = ${format(iops)}`);
  };

const Count = ({ from, to }: CountProps) => {
  let n = from;
  return new ReadableStream<number>({
    pull(controller) {
      if (n < to) {
        controller.enqueue(n);
        n++;
      }
      if (n == to) {
        controller.close();
      }
    },
  });
};

const Filter = <I>(callback: (value: I) => boolean) => {
  return new TransformStream<I>({
    transform(value, controller) {
      if (callback(value)) {
        controller.enqueue(value);
      }
    },
  });
};

const Consumer = <W>(callback: (value: W) => void) => {
  return new WritableStream<W>({
    write(value) {
      callback(value);
    },
  });
};
