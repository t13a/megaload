export const formatNumber = (value: number | bigint) =>
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
