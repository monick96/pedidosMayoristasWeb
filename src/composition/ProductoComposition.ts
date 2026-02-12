import { GetProductosUseCase } from "../aplication/use-cases/GetProductosUseCase";
import { ProductoRepositoryInMemory } from "../infrastructure/peristence/repositorie/ProductoRepositoryInMemory";

export function productComposition() {
  const repository = new ProductoRepositoryInMemory();
  return new GetProductosUseCase(repository);
}