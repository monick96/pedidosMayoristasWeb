import { ProductoRepositoryPort } from "../../../aplication/ports/ProductoRepositorioPort";
import { Producto } from "../../../domain/entities/Producto";
import { fail, ok } from "../../../shared/Result";
import { PRODUCTS_MOCK } from "../in-memory/products.mock";

export class ProductoRepositoryInMemory implements ProductoRepositoryPort {

  async getAll() {
    try {
      return ok<Producto[]>(PRODUCTS_MOCK);
    } catch (error) {
      return fail<Producto[]>(error as Error);
    }
  }

}