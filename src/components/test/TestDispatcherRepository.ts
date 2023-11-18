import { TestDipatcher } from ".";

export class TestDispatcherRepository {
  private map = new Map<string, TestDipatcher>();

  register(name: string, dispatcher: TestDipatcher) {
    this.map.set(name, dispatcher);
  }

  resolve(name: string) {
    const dispatcher = this.map.get(name);
    if (!dispatcher) {
      throw new Error(`Unregistered dispatcher: ${name}`);
    }
    return dispatcher;
  }
}
