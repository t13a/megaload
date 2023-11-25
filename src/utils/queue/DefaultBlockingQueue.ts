import { BlockingQueue } from ".";

export class DefaultBlockingQueue<T> implements BlockingQueue<T> {
  private capacity;
  private values: T[] = [];
  private done = false;
  private dequeuings: ((input: IteratorResult<T>) => void)[] = [];
  private enqueuings: (() => void)[] = [];

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new RangeError("The capacity must be greater than zero.");
    }

    this.capacity = capacity;
  }

  dequeue(): Promise<IteratorResult<T>> {
    return new Promise(async (resolve) => {
      if (this.enqueuings.length > 0) {
        this.enqueuings.shift()!();
      }

      if (this.values.length > 0) {
        resolve({ value: this.values.shift()! });
        return;
      }

      if (this.done) {
        resolve({ done: true, value: undefined });
        return;
      }

      this.dequeuings.push((input) => {
        resolve(input);
      });
    });
  }

  enqueue(input: IteratorResult<T, any>): Promise<void> {
    return new Promise((resolve) => {
      if (this.done) {
        resolve();
        return;
      }

      this.enqueuings.push(() => {
        if (this.done) {
          resolve();
          return;
        }

        if (input.done) {
          this.done = true;
        } else {
          this.values.push(input.value);
        }

        resolve();

        if (this.done) {
          for (let i = 0; i < this.enqueuings.length; i++) {
            this.enqueuings[i]();
          }
          this.enqueuings.length = 0;

          for (let i = 0; i < this.dequeuings.length; i++) {
            this.dequeuings[i](input);
          }
          this.dequeuings.length = 0;
        }
      });

      if (this.values.length < this.capacity) {
        this.enqueuings.shift()!();
      }

      if (this.dequeuings.length > 0) {
        this.dequeuings.shift()!({ value: this.values.shift()! });
      }
    });
  }

  async enqueueAll(input: Iterable<T> | AsyncIterable<T>): Promise<void> {
    for await (const value of input) {
      await this.enqueue({ value });
    }

    this.enqueue({ done: true, value: undefined });
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return new DefaultBlockingQueueAsyncIterator(this);
  }
}

class DefaultBlockingQueueAsyncIterator<T> implements AsyncIterator<T> {
  private queue;

  constructor(queue: BlockingQueue<T>) {
    this.queue = queue;
  }

  async next(): Promise<IteratorResult<T>> {
    return await this.queue.dequeue();
  }
}
