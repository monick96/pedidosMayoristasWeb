import { Producto } from "../../domain/entities/Producto";
import { Result } from "../../shared/Result";

export interface ProductoRepositoryPort {
   getAll(): Promise<Result<Producto[]>>;
}