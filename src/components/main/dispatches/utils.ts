import { CountProps } from ".";

export const count = ({ from = 1, to = Number.MAX_SAFE_INTEGER }: CountProps) =>
  (function* () {
    for (let n = from; n <= to; n++) {
      yield n;
    }
  })();

export const format = (value: number | bigint) =>
  new Intl.NumberFormat().format(value);

export const isPrime = (n: number) => {
  if (n <= 1) {
    return false;
  }
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
};
