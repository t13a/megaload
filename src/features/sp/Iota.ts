import { StreamProcessor } from ".";

export type IotaProps = {
  first?: number;
  last?: number;
};

export const Iota = ({
  first = 0,
  last = Number.MAX_SAFE_INTEGER,
}: IotaProps): StreamProcessor<void, number> =>
  async function* ({ signal, ...context }) {
    const logger = context.logger.create(Iota.name);
    logger.begin();

    if (first < last) {
      for (let i = first; i < last; i++) {
        if (signal.aborted) {
          break;
        }

        yield i;
      }
    }

    logger.end();
  };
