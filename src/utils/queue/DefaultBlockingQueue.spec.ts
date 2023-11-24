import { DefaultBlockingQueue } from ".";

describe("DefaultBlockingQueue", () => {
  it("returns a value if not empty", async () => {
    const queue = new DefaultBlockingQueue<number>();

    queue.enqueue({ value: 1 });
    queue.enqueue({ value: 2 });
    queue.enqueue({ value: 3 });

    expect((await queue.dequeue()).value).toBe(1);
    expect((await queue.dequeue()).value).toBe(2);
    expect((await queue.dequeue()).value).toBe(3);
  });

  it("blocks if empty", async () => {
    const beginAt = new Date().getTime();
    const queue = new DefaultBlockingQueue<number>();

    setTimeout(() => queue.enqueue({ value: 1 }), 100);
    setTimeout(() => queue.enqueue({ value: 2 }), 200);
    setTimeout(() => queue.enqueue({ value: 3 }), 300);

    expect((await queue.dequeue()).value).toBe(1);
    expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(100);
    expect((await queue.dequeue()).value).toBe(2);
    expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(200);
    expect((await queue.dequeue()).value).toBe(3);
    expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(300);
  });

  it("returns nothing if closed", async () => {
    const beginAt = new Date().getTime();
    const queue = new DefaultBlockingQueue<number>();

    setTimeout(() => queue.enqueue({ done: true, value: undefined }), 100);

    expect((await queue.dequeue()).done).toBe(true);
    expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(100);
  });

  it("is an async iterable object", async () => {
    const queue = new DefaultBlockingQueue<number>();

    queue.enqueue({ value: 1 });
    queue.enqueue({ value: 2 });
    queue.enqueue({ value: 3 });
    queue.enqueue({ value: undefined, done: true });

    const asyncIterator = queue[Symbol.asyncIterator]();

    expect((await asyncIterator.next()).value).toBe(1);
    expect((await asyncIterator.next()).value).toBe(2);
    expect((await asyncIterator.next()).value).toBe(3);
    expect((await asyncIterator.next()).done).toBe(true);
  });
});
