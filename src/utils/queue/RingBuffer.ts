import { QueueBuffer } from "./types";

export class RingBuffer<T> implements QueueBuffer<T> {
  private capacity;
  private buffer: (T | undefined)[];
  private startIndex: number = 0;
  private _length: number = 0;

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new RangeError("The capacity must be greater than zero.");
    }

    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  private offsetIndex(value: number) {
    if (this.startIndex + value < this.capacity) {
      return this.startIndex + value;
    } else {
      return this.startIndex + value - this.capacity;
    }
  }

  get length() {
    return this._length;
  }

  push(...items: T[]): number {
    for (let i = 0; i < items.length; i++) {
      this.buffer[this.offsetIndex(this._length)] = items[i];

      if (this._length < this.capacity) {
        this._length++;
      } else {
        this.startIndex = this.offsetIndex(1);
      }
    }

    return this._length;
  }

  shift(): T | undefined {
    if (this._length === 0) {
      return undefined;
    }

    const item = this.buffer[this.startIndex];
    this.buffer[this.startIndex] = undefined;
    this.startIndex = this.offsetIndex(1);
    this._length--;
    return item;
  }
}
