export class EmptyInput implements AsyncIterable<void> {
  [Symbol.asyncIterator]() {
    return new EmptyInputIterator();
  }
}

class EmptyInputIterator implements AsyncIterator<void> {
  next(): Promise<IteratorResult<void, any>> {
    return new Promise((resolve) => resolve({ done: true, value: undefined }));
  }
}
