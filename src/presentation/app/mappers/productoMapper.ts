import { Producto } from "../../../domain/entities/Producto";
import { CalculadorPrecioProducto } from "../../../domain/services/CalculadorPrecioProducto";
import { ImagenProducto } from "../../../domain/value-objects/ImagenProducto";
import { ImagenProductoVM, ProductoVM } from "../models/productoVm";
import { PRODUCTO} from "../../../domain/value-objects/TipoProducto";

export function productoToVM(p: Producto): ProductoVM {
  //  Guardamos si tiene promo en una variable
  const tienePromo = CalculadorPrecioProducto.tienePromocion(p);

  // Verificamos si la lista imagenes está vacía o es nula
  const imagenesVacias = !p.images || p.images.length === 0;

  // Calculamos el precio final antes de armar el objeto
  const precioFinal = CalculadorPrecioProducto.calcularPrecioFinal(p);

  // Solo lo apagamos si Firebase dice EXACTAMENTE "false". 
  // Si no existe (undefined) o es nulo, asumimos que es true.
  const estaActivo = p.activo !== false; 
  const tieneStock = p.estaDisponible !== false;

  if (!p.preciosMayorista || p.preciosMayorista.length === 0) {
    p.preciosMayorista = [
      { tipo: 'MAYORISTA_1', porcentaje: 0 },
      { tipo: 'MAYORISTA_2', porcentaje: 0 },
      { tipo: 'MAYORISTA_3', porcentaje: 0 }
    ];
  }
 
  return {
    codigo: p.codigo,
    marcaId: p.marcaId,
    titulo: p.descripcion,
    descripcion: p.descripcion,
    sabor:p.sabor,
    precioFinal: precioFinal,
    precioNormal: CalculadorPrecioProducto.calcularPrecioNormal(p),
    tienePromo,
    pesoKg: p.pesoKg,
    esNovedad: p.esNovedad || false,
    tipo:PRODUCTO,
    // Si no hay precio, no está disponible
    estaDisponible: tieneStock && precioFinal > 0 && estaActivo,
    unidadesPorCaja: p.unidadesPorCaja,
    //Solo calculamos y enviamos la escala si NO hay promo
    preciosPorEscala: tienePromo 
      ? undefined 
      : CalculadorPrecioProducto.calcularPreciosPorEscala(p),
    // Ordenamos por el campo 'order' si existe antes de mapear
    images:imagenesVacias 
      ? [{ url: 'https://dcdn-us.mitiendanube.com/assets/stores/img/no-photo-1024-1024.webp', alt: 'imagen por defecto' }]
      : p.images?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(imagenProductoToVM)
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