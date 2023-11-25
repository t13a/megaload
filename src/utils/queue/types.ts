export interface BlockingQueue<T> extends AsyncIterable<T> {
  dequeue(): Promise<IteratorResult<T>>;
  enqueue(input: IteratorResult<T>): Promise<void>;
  enqueueAll(input: Iterable<T> | AsyncIterable<T>): Promise<void>;
}

export type QueueBuffer<T> = Pick<T[], "length"> &
  Pick<T[], "push"> &
  Pick<T[], "shift">;
