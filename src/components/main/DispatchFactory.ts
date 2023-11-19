import { Dipatch } from ".";

export type DispatchFactory = () => Dipatch;

export interface DispatchFactoryRepository {
  register(name: string, dispatchFactory: DispatchFactory): void;
  resolve(name: string): DispatchFactory;
}
