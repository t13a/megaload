import { Dipatcher } from ".";

export type DispatcherFactory = () => Dipatcher;

export interface DispatcherFactoryRepository {
  register(name: string, dispatcherFactory: DispatcherFactory): void;
  resolve(name: string): DispatcherFactory;
}
