import { Combo } from "../../domain/entities/Combo";
import { Result } from "../../shared/Result";
import { ComboRepositorioPort } from "../ports/ComboRepositorio";

export class GetCombosUseCase {

  constructor(
    private readonly comboRepository: ComboRepositorioPort
  ) {}

  async execute(): Promise<Result<Combo[]>> {
    return await this.comboRepository.getAll();
  }
}