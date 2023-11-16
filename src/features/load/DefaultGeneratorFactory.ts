import {
  LoadGenerator,
  LoadGeneratorFactory,
  LoadGeneratorFactoryToken,
} from ".";

export type DefaultLoadGeneratorFactoryOptions<
  K extends LoadGeneratorFactoryToken,
> = {
  generatorFactories: Partial<Record<K, () => LoadGenerator>>;
};

export class DefaultLoadGeneratorFactory<
  Token extends LoadGeneratorFactoryToken,
> implements LoadGeneratorFactory<Token>
{
  private options;

  constructor(options: DefaultLoadGeneratorFactoryOptions<Token>) {
    this.options = options;
  }

  create(token: Token): LoadGenerator {
    const generatorFactory = this.options.generatorFactories[token];
    if (!generatorFactory) {
      throw new Error(`Unregistered generator: ${token}`);
    }
    return generatorFactory();
  }
}
