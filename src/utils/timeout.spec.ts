import { timeout } from ".";

describe("timeout", () => {
  it("waits for specified milli seconds", async () => {
    const start = new Date().getTime();
    await timeout(100);
    const end = new Date().getTime();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });

  it("waits for specified milli seconds, then call the callback", async () => {
    const start = new Date().getTime();
    let done = false;
    await timeout(100, () => (done = true));
    const end = new Date().getTime();
    expect(end - start).toBeGreaterThanOrEqual(100);
    expect(done).toBe(true);
  });
});
