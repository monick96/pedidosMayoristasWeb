import { Combo } from "../../domain/entities/Combo";
import { Result } from "../../shared/Result";

export interface ComboRepositorioPort {
  getAll(): Promise<Result<Combo[]>>;
  updateActivo(codigo: string, activo: boolean): Promise<Result<void>>;
  updateNovedad(codigo: string, esNovedad: boolean): Promise<Result<void>>;
}