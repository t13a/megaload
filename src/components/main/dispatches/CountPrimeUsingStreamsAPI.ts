import { CountProps, DelayProps, formatNumber, isPrime } from ".";
import { Dipatch } from "../Dispatch";

export const CountPrimeUsingStreamsAPI =
  ({ from, to }: CountProps, { time }: DelayProps): Dipatch =>
  async ({ signal, ...context }) => {
    let result = 0;

    const beginAt = new Date().getTime();

    const r1 = Count({ from, to }, { time }, signal);
    const t1 = Filter(isPrime);
    const w1 = Consumer((n: number) => result++);

    await r1.pipeThrough(t1).pipeTo(w1);

    const endAt = new Date().getTime();

    context.writer(`result = ${formatNumber(result)}`);

    const n = to - from + 1;
    const ms = endAt - beginAt;
    const iops = n / ((endAt - beginAt) / 1000);
    context.writer(
      `n = ${formatNumber(n)} (${formatNumber(from)}~${formatNumber(to)})`,
    );
    context.writer(`ms = ${formatNumber(ms)}`);
    context.writer(`iops = ${formatNumber(iops)}`);
  };

const Count = (
  { from, to }: CountProps,
  { time }: DelayProps,
  signal: AbortSignal,
) => {
  let n = from;
  let t1 = new Date().getTime();
  return new ReadableStream<number>({
    async pull(controller) {
      const t2 = new Date().getTime();
      if (t2 - t1 >= time) {
        await new Promise((resolve) => setTimeout(resolve));
        t1 = t2;
      }
      if (signal.aborted) {
        controller.close();
        return;
      }
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
