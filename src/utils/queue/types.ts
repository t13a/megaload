export interface BlockingQueue<T> extends AsyncIterable<T> {
  dequeue(): Promise<IteratorResult<T>>;
  enqueue(input: IteratorResult<T>): Promise<void>;
  enqueueAll(input: Iterable<T> | AsyncIterable<T>): Promise<void>;
  enqueueDone(): Promise<void>;
  enqueueValue(input: T): Promise<void>;
  enqueueValues(input: Iterable<T> | AsyncIterable<T>): Promise<void>;
}

export type QueueBuffer<T> = {
  [P in "at" | "length" | "push" | "shift"]: T[][P];
};
