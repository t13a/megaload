import { QueueBuffer } from "./types";

export class RingBuffer<T> implements QueueBuffer<T> {
  private capacity;
  private data: (T | undefined)[];
  private startIndex: number = 0;
  private _length: number = 0;

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new RangeError("The capacity must be greater than zero.");
    }

    this.capacity = capacity;
    this.data = new Array(capacity);
  }

  private offsetIndex(index: number) {
    if (this.startIndex + index < this.capacity) {
      return this.startIndex + index;
    } else {
      return this.startIndex + index - this.capacity;
    }
  }

  get length() {
    return this._length;
  }

  set length(value: number) {
    if (value === 0) {
      this.data = new Array(this.capacity);
      this.startIndex = 0;
      this._length = 0;
    } else {
      throw new Error("Not implemented yet");
    }
  }

  at(index: number) {
    if (index < 0 || index >= this.capacity) {
      return undefined;
    }

    return this.data[this.offsetIndex(index)];
  }

  push(...items: T[]): number {
    for (let i = 0; i < items.length; i++) {
      this.data[this.offsetIndex(this._length)] = items[i];

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

    const item = this.data[this.startIndex];
    this.data[this.startIndex] = undefined;
    this.startIndex = this.offsetIndex(1);
    this._length--;
    return item;
  }
}
