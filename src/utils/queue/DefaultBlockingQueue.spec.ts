import { DefaultBlockingQueue } from ".";

describe("DefaultBlockingQueue", () => {
  describe("constructor", () => {
    it.failing(
      "throw an error if the capacity is less than or equal to zero",
      () => {
        new DefaultBlockingQueue<number>(0);
      },
    );
  });

  describe("dequeue", () => {
    it("returns a value if the queue is not empty", async () => {
      const queue = new DefaultBlockingQueue<number>(3);

      await queue.enqueue({ value: 1 });
      expect((await queue.dequeue()).value).toBe(1);

      await queue.enqueue({ value: 2 });
      await queue.enqueue({ value: 3 });
      expect((await queue.dequeue()).value).toBe(2);
      expect((await queue.dequeue()).value).toBe(3);
    });

    it("blocks if the queue is empty", async () => {
      let beginAt: number;
      const queue = new DefaultBlockingQueue<number>(3);

      beginAt = new Date().getTime();
      setTimeout(async () => await queue.enqueue({ value: 1 }), 10);
      expect((await queue.dequeue()).value).toBe(1);
      expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(10);

      beginAt = new Date().getTime();
      setTimeout(async () => await queue.enqueue({ value: 2 }), 10);
      setTimeout(async () => await queue.enqueue({ value: 3 }), 10);
      expect((await queue.dequeue()).value).toBe(2);
      expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(10);
      expect((await queue.dequeue()).value).toBe(3);
      expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(10);
    });

    it("returns nothing if the queue is empty and done", async () => {
      const queue = new DefaultBlockingQueue<number>(3);

      await queue.enqueue({ done: true, value: undefined });
      expect((await queue.dequeue()).done).toBe(true);
      expect((await queue.dequeue()).done).toBe(true);
    });

    it("returns a value if the queue is not empty but done", async () => {
      const queue = new DefaultBlockingQueue<number>(3);

      await queue.enqueue({ value: 1 });
      await queue.enqueue({ done: true, value: undefined });
      expect((await queue.dequeue()).value).toBe(1);
      expect((await queue.dequeue()).done).toBe(true);
    });
  });

  describe("enqueue", () => {
    it("does not block if the queue is not full", async () => {
      const queue = new DefaultBlockingQueue<number>(3);

      await queue.enqueue({ value: 1 });
    });

    it("blocks if the queue is full", async () => {
      const queue = new DefaultBlockingQueue<number>(3);
      await queue.enqueue({ value: 1 });
      await queue.enqueue({ value: 2 });
      await queue.enqueue({ value: 3 });

      const beginAt = new Date().getTime();
      setTimeout(async () => expect((await queue.dequeue()).value).toBe(1), 10);
      await queue.enqueue({ value: 4 });
      expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(10);
    });

    it("does not block if the queue is done", async () => {
      const queue = new DefaultBlockingQueue<number>(3);
      await queue.enqueue({ value: 1 });
      await queue.enqueue({ value: 2 });
      await queue.enqueue({ done: true, value: undefined });

      const beginAt = new Date().getTime();
      await queue.enqueue({ value: 3 });
      await queue.enqueue({ value: 4 });
      expect(new Date().getTime() - beginAt).toBeLessThan(1);
    });
  });

  describe("enqueueAll", () => {
    it("does not block if the queue is not full", async () => {
      const queue = new DefaultBlockingQueue<number>(3);

      queue.enqueueAll(
        (async function* () {
          yield* [1, 2, 3];
        })(),
      );
      expect((await queue.dequeue()).value).toBe(1);
      expect((await queue.dequeue()).value).toBe(2);
      expect((await queue.dequeue()).value).toBe(3);
    });

    it("blocks if the queue is full", async () => {
      const queue = new DefaultBlockingQueue<number>(3);
      await queue.enqueue({ value: 1 });
      await queue.enqueue({ value: 2 });
      await queue.enqueue({ value: 3 });

      const beginAt = new Date().getTime();
      setTimeout(async () => expect((await queue.dequeue()).value).toBe(1), 10);
      setTimeout(async () => expect((await queue.dequeue()).value).toBe(2), 20);
      setTimeout(async () => expect((await queue.dequeue()).value).toBe(3), 30);
      await queue.enqueueAll(
        (async function* () {
          yield* [4, 5, 6];
        })(),
      );
      expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(30);
    });

    it("blocks if the queue is full in the middle of the iteration", async () => {
      const queue = new DefaultBlockingQueue<number>(3);
      await queue.enqueue({ value: 1 });
      await queue.enqueue({ value: 2 });

      const beginAt = new Date().getTime();
      setTimeout(async () => expect((await queue.dequeue()).value).toBe(1), 10);
      setTimeout(async () => expect((await queue.dequeue()).value).toBe(2), 20);
      await queue.enqueueAll(
        (async function* () {
          yield* [3, 4, 5];
        })(),
      );
      expect(new Date().getTime() - beginAt).toBeGreaterThanOrEqual(20);
    });
  });

  it("can use as an async iterator", async () => {
    const queue = new DefaultBlockingQueue<number>(3);
    await queue.enqueue({ value: 1 });
    await queue.enqueue({ value: 2 });
    await queue.enqueue({ value: undefined, done: true });

    const asyncIterator = queue[Symbol.asyncIterator]();
    expect((await asyncIterator.next()).value).toBe(1);
    expect((await asyncIterator.next()).value).toBe(2);
    expect((await asyncIterator.next()).done).toBe(true);
  });
});
