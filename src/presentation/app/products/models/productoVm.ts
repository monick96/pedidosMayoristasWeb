import { tipoProducto } from "./tipoProducto";

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
}

export interface ImagenProductoVM {
  url: string;
  alt?: string;
  small?: string;
  medium?: string;
  large?: string;
}