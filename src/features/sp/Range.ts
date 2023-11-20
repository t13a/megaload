import { StreamProcessor } from ".";

export type RangeProps = {
  start?: number;
  end?: number;
};

export const Range = ({
  start = 0,
  end = Number.MAX_SAFE_INTEGER,
}: RangeProps): StreamProcessor<void, number> =>
  async function* ({ signal, ...context }) {
    const logger = context.logger.create(Range.name);
    logger.begin();

    if (start < end) {
      for (let i = start; i < end; i++) {
        if (signal.aborted) {
          break;
        }

        yield i;
      }
    }

    logger.end();
  };
