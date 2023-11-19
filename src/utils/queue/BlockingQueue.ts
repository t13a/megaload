export interface BlockingQueue<T> extends AsyncIterable<T> {
  dequeue(): Promise<IteratorResult<T>>;
  enqueue(input: IteratorResult<T>): void;
  enqueueAll(input: Iterable<T> | AsyncIterable<T>): Promise<void>;
}
