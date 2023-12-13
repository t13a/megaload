export type Unblock = () => Promise<boolean>;

export const createUnblock = (interval: number): Unblock => {
  let last = new Date().getTime();

  return async () => {
    const now = new Date().getTime();

    if (now >= last + interval) {
      await new Promise((resolve) => setTimeout(resolve));
      last = new Date().getTime();
      return true;
    }

    return false;
  };
};
