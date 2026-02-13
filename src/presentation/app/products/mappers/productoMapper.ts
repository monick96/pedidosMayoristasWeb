import { Producto } from "../../../../domain/entities/Producto";
import { CalculadorPrecioProducto } from "../../../../domain/services/CalculadorPrecioProducto";
import { ImagenProducto } from "../../../../domain/value-objects/ImagenProducto";
import { ImagenProductoVM, ProductoVM } from "../models/productoVm";
import { PRODUCTO} from "../../../../domain/value-objects/TipoProducto";

export function productoToVM(p: Producto): ProductoVM {
 
  return {
    codigo: p.codigo,
    marcaId: p.marcaId,
    titulo: p.descripcion,
    descripcion: p.descripcion,
    sabor:p.sabor,
    precioFinal: CalculadorPrecioProducto.calcularPrecioFinal(p),
    precioNormal: CalculadorPrecioProducto.calcularPrecioNormal(p),
    tienePromo: CalculadorPrecioProducto.tienePromocion(p),
    pesoKg: p.pesoKg,
    esNovedad: p.esNovedad || false,
    tipo:PRODUCTO,
    // Ordenamos por el campo 'order' si existe antes de mapear
    images: p.images?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(imagenProductoToVM)
  };
}

export function imagenProductoToVM(img: ImagenProducto): ImagenProductoVM {
  return {
    url: img.url,
    alt: img.alt,
    small: img.small,
    medium: img.medium,
    large: img.large
    }
};