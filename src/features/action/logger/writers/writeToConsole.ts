import { Log, Writer } from "..";

export const writeToConsole = (): Writer => {
  return (log: Log) => {
    switch (log.level) {
      case "debug":
        console.debug(log.data);
        break;
      case "info":
        console.info(log.data);
        break;
      case "warn":
        console.warn(log.data);
        break;
      case "error":
        console.error(log.data);
        break;
    }
  };
};
