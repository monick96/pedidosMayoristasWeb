import { Producto } from "../../../../domain/entities/Producto";
import { CalculadorPrecioProducto } from "../../../../domain/services/CalculadorPrecioProducto";
import { ImagenProducto } from "../../../../domain/value-objects/ImagenProducto";
import { ImagenProductoVM, ProductoVM } from "../models/productoVm";
import { PRODUCTO} from "../../../../domain/value-objects/TipoProducto";

export function productoToVM(p: Producto): ProductoVM {
  // 1. Guardamos si tiene promo en una variable
  const tienePromo = CalculadorPrecioProducto.tienePromocion(p);
 
  return {
    codigo: p.codigo,
    marcaId: p.marcaId,
    titulo: p.descripcion,
    descripcion: p.descripcion,
    sabor:p.sabor,
    precioFinal: CalculadorPrecioProducto.calcularPrecioFinal(p),
    precioNormal: CalculadorPrecioProducto.calcularPrecioNormal(p),
    tienePromo,
    pesoKg: p.pesoKg,
    esNovedad: p.esNovedad || false,
    tipo:PRODUCTO,
    estaDisponible: p.estaDisponible || false,
    unidadesPorCaja: p.unidadesPorCaja,
    //Solo calculamos y enviamos la escala si NO hay promo
    preciosPorEscala: tienePromo 
      ? undefined 
      : CalculadorPrecioProducto.calcularPreciosPorEscala(p),
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