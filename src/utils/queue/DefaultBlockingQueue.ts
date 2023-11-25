import { BlockingQueue, RingBuffer } from ".";

export class DefaultBlockingQueue<T> implements BlockingQueue<T> {
  private capacity;
  private done = false;
  private values;
  private dequeuings: ((input: IteratorResult<T>) => void)[] = [];
  private enqueuings: (() => void)[] = [];

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new RangeError("The capacity must be greater than zero.");
    }

    this.capacity = capacity;
    this.values = new RingBuffer<T>(capacity);
  }

  dequeue(): Promise<IteratorResult<T>> {
    return new Promise(async (resolve) => {
      if (this.values.length > 0) {
        resolve({ value: this.values.shift()! });
      } else {
        const onDequeue = (input: IteratorResult<T>) => {
          resolve(input);

          if (this.done && this.dequeuings.length > 0) {
            for (const dequeuing of this.dequeuings) {
              dequeuing({ done: true, value: undefined });
            }
            this.dequeuings.length = 0;
          }
        };

        if (this.done) {
          onDequeue({ done: true, value: undefined });
        } else {
          this.dequeuings.push(onDequeue);
        }
      }

      if (this.enqueuings.length > 0) {
        this.enqueuings.shift()!();
      }
    });
  }

  enqueue(input: IteratorResult<T, any>): Promise<void> {
    return new Promise((resolve) => {
      if (this.done) {
        resolve();
      } else {
        const onEnqueue = () => {
          if (input.done) {
            this.done = true;
          }

          if (this.dequeuings.length > 0) {
            this.dequeuings.shift()!(input);
          } else if (!input.done) {
            this.values.push(input.value);
          }

          resolve();
        };

        if (
          input.done ||
          this.dequeuings.length > 0 ||
          this.values.length < this.capacity
        ) {
          onEnqueue();
        } else {
          this.enqueuings.push(onEnqueue);
        }
      }
    });
  }

  async enqueueAll(input: Iterable<T> | AsyncIterable<T>): Promise<void> {
    await this.enqueueValues(input);
    await this.enqueueDone();
  }

  async enqueueDone(): Promise<void> {
    await this.enqueue({ done: true, value: undefined });
  }

  async enqueueValue(value: T): Promise<void> {
    await this.enqueue({ value });
  }

  async enqueueValues(input: AsyncIterable<T> | Iterable<T>): Promise<void> {
    for await (const value of input) {
      await this.enqueue({ value });
    }
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
