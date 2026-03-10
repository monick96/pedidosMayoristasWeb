import { ProductoRepositoryPort } from '../ports/ProductoRepositorioPort';
import { Result } from '../../shared/Result';

export class UpdateProductoUnidadesUseCase {
  constructor(private readonly repo: ProductoRepositoryPort) {}

  async execute(codigo: string, unidades: number): Promise<Result<void>> {
    return this.repo.updateUnidadesPorCaja(codigo, unidades);
  }
}