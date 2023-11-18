import { TestDipatcher } from "../TestDispatcher";

export type CountProps = {
  from: number;
  to: number;
  verbosity: "quiet" | "verbose";
};

export const Count =
  ({ from, to, verbosity }: CountProps): TestDipatcher =>
  async ({ logger }) => {
    logger.begin();

    for (let n = from; n <= to; n++) {
      switch (verbosity) {
        case "quiet":
          if (n == from || n == to) {
            logger.info(n);
          }
          break;
        case "verbose":
          logger.info(n);
          break;
      }
    }

    logger.end();
  };
