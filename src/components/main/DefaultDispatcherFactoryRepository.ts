import { DispatcherFactory, DispatcherFactoryRepository } from ".";

export class DefaultDispatcherFactoryRepository
  implements DispatcherFactoryRepository
{
  private map = new Map<string, DispatcherFactory>();

  register(name: string, dispatcherFactory: DispatcherFactory) {
    this.map.set(name, dispatcherFactory);
  }

  resolve(name: string) {
    const dispatcher = this.map.get(name);
    if (!dispatcher) {
      throw new Error(`Unregistered dispatcher factory: ${name}`);
    }
    return dispatcher;
  }
}
