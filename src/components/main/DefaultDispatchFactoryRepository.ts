import { DispatchFactory, DispatchFactoryRepository } from ".";

export class DefaultDispatchFactoryRepository
  implements DispatchFactoryRepository
{
  private map = new Map<string, DispatchFactory>();

  register(name: string, dispatchFactory: DispatchFactory) {
    this.map.set(name, dispatchFactory);
  }

  resolve(name: string) {
    const dispatch = this.map.get(name);
    if (!dispatch) {
      throw new Error(`Unregistered dispatch factory: ${name}`);
    }
    return dispatch;
  }
}
