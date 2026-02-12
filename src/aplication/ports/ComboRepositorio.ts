import { Combo } from "../../domain/entities/Combo";
import { Result } from "../../shared/Result";

export interface ComboRepositorioPort {
  getAll(): Promise<Result<Combo[]>>;
}