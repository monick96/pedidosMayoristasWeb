import { ProductoRepositoryPort } from '../ports/ProductoRepositorioPort';
import { Result } from '../../shared/Result';

export class UpdateProductoActivoUseCase {
  constructor(private readonly repo: ProductoRepositoryPort) {}

  async execute(codigo: string, activo: boolean): Promise<Result<void>> {
    return this.repo.updateActivo(codigo, activo);
  }
}