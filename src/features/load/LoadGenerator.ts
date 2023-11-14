export interface LoadGenerator {
  generate(): AsyncIterable<string>;
}
