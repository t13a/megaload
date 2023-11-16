import { LoadGenerator } from ".";

export type LoadGeneratorFactoryToken = string | number;

export interface LoadGeneratorFactory<Token extends LoadGeneratorFactoryToken> {
  create(token: Token): LoadGenerator;
}
