import { Producto } from "../../domain/entities/Producto";
import { Result } from "../../shared/Result";

export interface ProductoRepositoryPort {
   getAll(): Promise<Result<Producto[]>>;
   updateActivo(codigo: string, activo: boolean): Promise<Result<void>>;
   updateUnidadesPorCaja(codigo: string, unidades: number): Promise<Result<void>>;
   updateNovedad(codigo: string, esNovedad: boolean): Promise<Result<void>>;
}