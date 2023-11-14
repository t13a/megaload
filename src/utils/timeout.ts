export const timeout = (ms: number, callback: () => void = () => {}) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      callback();
      resolve();
    }, ms);
  });
};
