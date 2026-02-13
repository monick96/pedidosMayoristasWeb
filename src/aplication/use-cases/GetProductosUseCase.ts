import { ProductoRepositoryPort } from '../ports/ProductoRepositorioPort';
import { Result } from '../../shared/Result';
import { Producto } from '../../domain/entities/Producto';

export class GetProductosUseCase {


  constructor(
    private readonly repo: ProductoRepositoryPort
  ) {}
  

   async execute(): Promise<Result<Producto[]>> {
    return this.repo.getAll();
  }
}