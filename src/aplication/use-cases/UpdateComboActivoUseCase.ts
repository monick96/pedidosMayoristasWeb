import { ComboRepositorioPort } from '../ports/ComboRepositorio';
import { Result } from '../../shared/Result';

export class UpdateComboActivoUseCase {
  constructor(private readonly repo: ComboRepositorioPort) {}

  async execute(codigo: string, activo: boolean): Promise<Result<void>> {
    return this.repo.updateActivo(codigo, activo);
  }
}