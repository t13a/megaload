export type BlockingQueueOptions = {
  size: number;
  tick: number;
};

export class BlockingQueue<T> implements AsyncIterable<T> {
  private options: BlockingQueueOptions;
  private queue: IteratorResult<T>[] = [];

  constructor(options: Partial<BlockingQueueOptions> = {}) {
    this.options = { size: 1000, tick: 10, ...options };
  }

  dequeue(): Promise<IteratorResult<T>> {
    return new Promise(async (resolve) => {
      while (true) {
        const result = this.queue.shift();
        if (!result) {
          await sleep(this.options.tick);
          continue;
        }
        resolve(result);
        return;
      }
    });
  }

  enqueue(result: IteratorResult<T>): Promise<void> {
    return new Promise(async (resolve) => {
      while (true) {
        if (this.queue.length >= this.options.size) {
          await sleep(this.options.tick);
          continue;
        }
        this.queue.push(result);
        resolve();
        return;
      }
    });
  }

  [Symbol.asyncIterator](): AsyncIterator<T, any, undefined> {
    return new AsyncQueueIterator(() => this.dequeue());
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class AsyncQueueIterator<T> implements AsyncIterator<T> {
  private dequeue;

  constructor(dequeue: () => Promise<IteratorResult<T>>) {
    this.dequeue = dequeue;
  }

  next(): Promise<IteratorResult<T>> {
    return new Promise(async (resolve) => resolve(await this.dequeue()));
  }
}
