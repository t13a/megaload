import { RingBuffer } from ".";

describe("RingBuffer", () => {
  describe("constructor", () => {
    it.failing(
      "throw an error if the capacity is less than or equal to zero",
      () => {
        new RingBuffer<number>(0);
      },
    );
  });

  describe("at", () => {
    it("returns a value (capacity=1)", () => {
      const buffer = new RingBuffer<number>(1);

      expect(buffer.at(-1)).toBe(undefined);
      expect(buffer.at(0)).toBe(undefined);
      expect(buffer.at(1)).toBe(undefined);

      buffer.push(1);
      expect(buffer.at(-1)).toBe(undefined);
      expect(buffer.at(0)).toBe(1);
      expect(buffer.at(1)).toBe(undefined);
    });

    it("returns a value (capacity=2)", () => {
      const buffer = new RingBuffer<number>(2);

      expect(buffer.at(-1)).toBe(undefined);
      expect(buffer.at(0)).toBe(undefined);
      expect(buffer.at(1)).toBe(undefined);
      expect(buffer.at(2)).toBe(undefined);

      buffer.push(1);
      expect(buffer.at(-1)).toBe(undefined);
      expect(buffer.at(0)).toBe(1);
      expect(buffer.at(1)).toBe(undefined);
      expect(buffer.at(2)).toBe(undefined);

      buffer.push(2);
      expect(buffer.at(-1)).toBe(undefined);
      expect(buffer.at(0)).toBe(1);
      expect(buffer.at(1)).toBe(2);
      expect(buffer.at(2)).toBe(undefined);

      buffer.push(3);
      expect(buffer.at(-1)).toBe(undefined);
      expect(buffer.at(0)).toBe(2);
      expect(buffer.at(1)).toBe(3);
      expect(buffer.at(2)).toBe(undefined);
    });
  });

  describe("length", () => {
    it("is zero at initial state", () => {
      const buffer = new RingBuffer<number>(1);
      expect(buffer.length).toBe(0);
    });

    it("is always less than or equal to the capacity (capacity=1)", () => {
      const buffer = new RingBuffer<number>(1);

      buffer.push(1);
      expect(buffer.length).toBe(1);

      buffer.push(2);
      expect(buffer.length).toBe(1);
    });

    it("is always less than or equal to the capacity (capacity=2)", () => {
      const buffer = new RingBuffer<number>(2);

      buffer.push(1);
      expect(buffer.length).toBe(1);

      buffer.push(2);
      expect(buffer.length).toBe(2);

      buffer.push(3);
      expect(buffer.length).toBe(2);
    });

    it("is always greater than or equal to zero (capacity=1)", () => {
      const buffer = new RingBuffer<number>(1);

      buffer.shift();
      expect(buffer.length).toBe(0);

      buffer.push(1);
      expect(buffer.length).toBe(1);

      buffer.shift();
      expect(buffer.length).toBe(0);

      buffer.shift();
      expect(buffer.length).toBe(0);
    });

    it("is always greater than or equal to zero (capacity=2)", () => {
      const buffer = new RingBuffer<number>(2);

      buffer.shift();
      expect(buffer.length).toBe(0);

      buffer.push(1);
      expect(buffer.length).toBe(1);

      buffer.push(2);
      expect(buffer.length).toBe(2);

      buffer.shift();
      expect(buffer.length).toBe(1);

      buffer.shift();
      expect(buffer.length).toBe(0);

      buffer.shift();
      expect(buffer.length).toBe(0);
    });

    it("can use to clear all values (capacity=1)", () => {
      const buffer = new RingBuffer<number>(1);

      buffer.push(1);
      buffer.length = 0;
      expect(buffer.length).toBe(0);
      expect(buffer.shift()).toBe(undefined);
    });
  });

  describe("push", () => {
    it("returns new length (capacity=1)", () => {
      const buffer = new RingBuffer<number>(1);

      expect(buffer.push(1)).toBe(1);
      expect(buffer.push(2)).toBe(1);
      expect(buffer.push(3, 4)).toBe(1);
    });

    it("returns new length (capacity=2)", () => {
      const buffer = new RingBuffer<number>(2);

      expect(buffer.push(1)).toBe(1);
      expect(buffer.push(2)).toBe(2);
      expect(buffer.push(3, 4)).toBe(2);
    });
  });

  describe("shift", () => {
    it("returns the value (capacity=1)", () => {
      const buffer = new RingBuffer<number>(1);

      buffer.push(1);
      expect(buffer.shift()).toBe(1);
      expect(buffer.shift()).toBe(undefined);

      buffer.push(2, 3);
      expect(buffer.shift()).toBe(3);
      expect(buffer.shift()).toBe(undefined);

      buffer.push(4, 5, 6, 7);
      expect(buffer.shift()).toBe(7);
      expect(buffer.shift()).toBe(undefined);
    });

    it("returns the value (capacity=2)", () => {
      const buffer = new RingBuffer<number>(2);

      buffer.push(1);
      expect(buffer.shift()).toBe(1);
      expect(buffer.shift()).toBe(undefined);

      buffer.push(2, 3);
      expect(buffer.shift()).toBe(2);
      expect(buffer.shift()).toBe(3);
      expect(buffer.shift()).toBe(undefined);

      buffer.push(4, 5, 6, 7);
      expect(buffer.shift()).toBe(6);
      expect(buffer.shift()).toBe(7);
      expect(buffer.shift()).toBe(undefined);
    });
  });
});
