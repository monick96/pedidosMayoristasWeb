import { tipoProducto } from "../../../domain/value-objects/TipoProducto";

export interface ProductoVM {
  codigo: string;
  marcaId?: string;
  titulo?: string;
  sabor?:string
  descripcion: string;
  precioFinal: number;
  precioNormal?: number;
  tienePromo?: boolean;
  pesoKg?: number;
  tipo: tipoProducto;
  images?: ImagenProductoVM[];
  esNovedad?: boolean; 
  estaDisponible: boolean;
  unidadesPorCaja?: number;
  preciosPorEscala?: { nivel: string; precio: number }[];
}

export interface ImagenProductoVM {
  url: string;
  alt?: string;
  small?: string;
  medium?: string;
  large?: string;
}