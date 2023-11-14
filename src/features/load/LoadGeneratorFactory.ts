import { LoadGenerator } from "./LoadGenerator";

export type LoadGeneratorFactoryToken = string | number;

export interface LoadGeneratorFactory<Token extends LoadGeneratorFactoryToken> {
  create(token: Token): LoadGenerator;
}
