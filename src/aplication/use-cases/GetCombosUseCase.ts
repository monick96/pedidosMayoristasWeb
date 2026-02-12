import { Combo } from "../../domain/entities/Combo";
import { ComboCalculador } from "../../domain/services/ComboCalculador";
import { fail, ok, Result } from "../../shared/Result";
import { ComboRepositorioPort } from "../ports/ComboRepositorio";

export class GetCombosUseCase {

  constructor(
    private readonly comboRepository: ComboRepositorioPort
  ) {}

  async execute(): Promise<Result<Combo[]>> {
    return await this.comboRepository.getAll();

   /* if (result.isFail()) {
      return fail(result.error);
    }

    /const combos:Combo[] = result.value;

    const viewModels = combos.map(combo => ({
      codigo: combo.codigo,
      descripcion: this.buildDescripcion(combo),
      precioTotal: ComboCalculador.precioTotal(combo),
      pesoTotalGramos: ComboCalculador.pesoTotalGramos(combo),
      items: combo.items,
      images: combo.images
    }));

    return ok(viewModels);*/
  }

   // lógica de negocio, no de UI
  private buildDescripcion(combo: Combo): string {
    const uniqueDescriptions = new Set(
      combo.items.map(i => i.descripcion)
    );

    return `Combo ${combo.codigo}: ${Array.from(uniqueDescriptions).join(" + ")}`;
  }
}