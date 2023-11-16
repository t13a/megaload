import { BlockingQueue } from ".";

const timeout = (ms: number, callback: () => void = () => {}) =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      callback();
      resolve();
    }, ms),
  );

describe("BlockingQueue", () => {
  it("can dequeue if it has a value", async () => {
    const queue = new BlockingQueue<number>();
    await queue.enqueue({ value: 1 });
    await queue.enqueue({ value: 2 });
    await queue.enqueue({ value: 3 });
    expect((await queue.dequeue()).value).toBe(1);
    expect((await queue.dequeue()).value).toBe(2);
    expect((await queue.dequeue()).value).toBe(3);
  });
});

describe("BlockingQueue", () => {
  it("blocks dequeue if it doues not have a value", async () => {
    const start = new Date().getTime();
    const queue = new BlockingQueue<number>();
    timeout(100, async () => queue.enqueue({ value: 1 }));
    timeout(200, async () => queue.enqueue({ value: 2 }));
    timeout(300, async () => queue.enqueue({ value: 3 }));
    expect((await queue.dequeue()).value).toBe(1);
    expect(new Date().getTime() - start).toBeGreaterThanOrEqual(100);
    expect((await queue.dequeue()).value).toBe(2);
    expect(new Date().getTime() - start).toBeGreaterThanOrEqual(200);
    expect((await queue.dequeue()).value).toBe(3);
    expect(new Date().getTime() - start).toBeGreaterThanOrEqual(300);
  });
});

describe("BlockingQueue", () => {
  it("blocks enqueue as long as the queue size is full", async () => {
    const start = new Date().getTime();
    const queue = new BlockingQueue<number>({ size: 3 });
    timeout(100, async () => await queue.dequeue());
    await queue.enqueue({ value: 1 });
    await queue.enqueue({ value: 2 });
    await queue.enqueue({ value: 3 });
    expect(new Date().getTime() - start).toBeLessThanOrEqual(10);
    await queue.enqueue({ value: 4 });
    expect(new Date().getTime() - start).toBeGreaterThanOrEqual(100);
  });
});

describe("BlockingQueue", () => {
  it("can use as a async iterator", async () => {
    const queue = new BlockingQueue<number>();
    await queue.enqueue({ value: 1 });
    await queue.enqueue({ value: 2 });
    await queue.enqueue({ value: 3 });
    await queue.enqueue({ value: undefined, done: true });
    const asyncIterator = queue[Symbol.asyncIterator]();
    expect((await asyncIterator.next()).value).toBe(1);
    expect((await asyncIterator.next()).value).toBe(2);
    expect((await asyncIterator.next()).value).toBe(3);
    expect((await asyncIterator.next()).done).toBe(true);
  });
});
