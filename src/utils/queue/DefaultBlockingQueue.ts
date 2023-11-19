import { BlockingQueue } from ".";

type Resolve<T> = (value: IteratorResult<T>) => void;

export class DefaultBlockingQueue<T> implements BlockingQueue<T> {
  private values: T[] = [];
  private blockings: Resolve<T>[] = [];
  private closed = false;

  dequeue(): Promise<IteratorResult<T>> {
    return new Promise(async (blocking) => {
      if (this.values.length > 0) {
        blocking({ value: await this.values.shift()! });
      } else {
        if (this.closed) {
          blocking({ done: true, value: undefined });
        } else {
          this.blockings.push(blocking);
        }
      }
    });
  }

  enqueue(input: IteratorResult<T, any>): void {
    if (this.closed) {
      return;
    }
    if (input.done) {
      this.closed = true;
      this.blockings.forEach((blocking) =>
        blocking({ done: true, value: undefined }),
      );
      this.blockings.length = 0;
    } else {
      if (this.blockings.length > 0) {
        this.blockings.shift()!({ value: input.value });
      } else {
        this.values.push(input.value);
      }
    }
  }

  async enqueueAll(input: Iterable<T> | AsyncIterable<T>): Promise<void> {
    for await (const value of input) {
      this.enqueue({ value });
    }
    this.enqueue({ done: true, value: undefined });
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return new DefaultBlockingQueueAsyncIterator(this);
  }
}

export class DefaultBlockingQueueAsyncIterator<T> implements AsyncIterator<T> {
  private queue;

  constructor(queue: BlockingQueue<T>) {
    this.queue = queue;
  }

  async next(): Promise<IteratorResult<T>> {
    return await this.queue.dequeue();
  }
}
