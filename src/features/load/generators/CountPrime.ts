import { timeout } from "../../../utils/timeout";
import { LoadGenerator } from "../LoadGenerator";

export type CountPrimeOptions = {
  from: number;
  to: number;
};

export class CountPrime implements LoadGenerator {
  private options;

  constructor(options: CountPrimeOptions) {
    this.options = options;
  }

  generate(): AsyncIterable<string> {
    return (async function* (from, to) {
      for (let n = from; n <= to; n++) {
        if (isPrime(n)) {
          yield `${n}`;
        }
        await timeout(0);
      }
    })(this.options.from, this.options.to);
  }
}

export const isPrime = (n: number): boolean => {
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
