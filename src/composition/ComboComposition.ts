import { GetCombosUseCase } from "../aplication/use-cases/GetCombosUseCase";
import { ComboRepositoryInMemory } from "../infrastructure/peristence/repositorie/ComboInMemoryRepository";

export function comboComposition() {
  const repository = new ComboRepositoryInMemory();
  return new GetCombosUseCase(repository);
}