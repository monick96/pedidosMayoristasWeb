import { ImagenProductoVM } from "./productoVm";
import { tipoProducto } from "./tipoProducto";

export interface ComboVM {
  codigo: string;
  titulo?: string;
  marcaId?: string;
  descripcion: string;
  precioFinal: number;
  precioNormal?: number;
  esNovedad?: boolean; 

  pesoKg?: number;
  pesoGramos?: number;

  tipo: tipoProducto;

  images?: ImagenProductoVM[];
}