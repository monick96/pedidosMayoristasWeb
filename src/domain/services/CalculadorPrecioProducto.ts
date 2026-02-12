import { Producto } from "../entities/Producto";
import { MayoristaPrecio } from "../value-objects/PrecioMayorista";

export class CalculadorPrecioProducto{

  static calcularPrecioMayorista(
    producto: Producto,
    mayorista: MayoristaPrecio
  ): number {

    const porcentajeAplicable =
      producto.porcentajeDescuento && producto.porcentajeDescuento > 0
        ? producto.porcentajeDescuento
        : mayorista.porcentaje;

    return (
      producto.precioBase +
      (producto.precioBase * porcentajeAplicable) / 100);

  }

  static calcularPrecioFinal(producto:Producto) {
    return CalculadorPrecioProducto.calcularPrecioMayorista(
        producto,
        producto.preciosMayorista[0] // ej: MAYORISTA_1
      );
    
  }

  static calcularPrecioNormal(producto:Producto) {
    return producto.precioBase +
        (producto.precioBase * producto.preciosMayorista[0].porcentaje) / 100;
  }

  static tienePromocion(producto:Producto) {
    return !!producto.porcentajeDescuento && producto.porcentajeDescuento > 0;
    
  }

}

