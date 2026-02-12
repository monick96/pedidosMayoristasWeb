import { ComboRepositorioPort } from "../../../aplication/ports/ComboRepositorio";
import { Combo } from "../../../domain/entities/Combo";
import { fail, ok } from "../../../shared/Result";
import { COMBOS_MOCK } from "../in-memory/combosMock";
export class ComboRepositoryInMemory implements ComboRepositorioPort {

  async getAll() {
    try {
      return ok<Combo[]>(COMBOS_MOCK);
    } catch (error) {
      return fail<Combo[]>(error as Error);
    }
  }

}