import { Dipatcher } from ".";

export class DispatcherRepository {
  private map = new Map<string, Dipatcher>();

  register(name: string, dispatcher: Dipatcher) {
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
