import papaparse from "papaparse";
import { BlockingQueue } from "../../../utils/BlockingQueue";
import { LoadGenerator } from "../LoadGenerator";

export type ParseFileOptions = {
  file: File;
};

export class ParseFile implements LoadGenerator {
  private options;

  constructor(options: ParseFileOptions) {
    this.options = options;
  }

  generate(): AsyncIterable<string> {
    return (async function* (file) {
      if (file.type !== "text/csv") {
        yield `Unsupported type: ${file.type}`;
        return;
      }

      const queue = new BlockingQueue();

      // FIXME: Could not stop to parse.
      papaparse.parse(file, {
        step: async (record) => await queue.enqueue({ value: record.data }),
        complete: async () =>
          await queue.enqueue({ done: true, value: undefined }),
      });

      for await (const value of queue) {
        yield JSON.stringify(value);
      }
    })(this.options.file);
  }
}
