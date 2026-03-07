import { MayoristaPrecio } from "../value-objects/PrecioMayorista";
import { ImagenProducto } from "../value-objects/ImagenProducto";

export interface Producto {
  codigo: string;

  marcaId: string;

  sabor?: string;
  
  descripcion: string;

  precioBase: number;

  porcentajePrecioSugerido?: number;

  porcentajeDescuento?: number; // no todos los productos tienen descuento, pero para todos es el mismo cuando lo tiene

  pesoGramos?: number;

  pesoKg?: number;

  esNovedad?: boolean;

  activo?: boolean; // para ocultar productos que ya no se venden pero no queremos eliminar de la base de datos

  preciosMayorista: MayoristaPrecio[];

  images?: ImagenProducto[];

  estaDisponible?: boolean; 

  unidadesPorCaja?: number;
}
