import { Producto } from "../entities/Producto";
import { MayoristaPrecio } from "../value-objects/PrecioMayorista";

export class CalculadorPrecioProducto{
  //el negocio hasta ahora nunca uso numeros negativos para decuentos o porcentajes

  static calcularPrecioMayorista(
    producto: Producto,
    mayorista?: MayoristaPrecio
  ): number {

    //Si no hay datos del mayorista, asumimos 0% de aumento
    const porcentajeMayorista = mayorista ? mayorista.porcentaje : 0;

    const porcentajeAplicable =
      producto.porcentajeDescuento && producto.porcentajeDescuento > 0
        ? producto.porcentajeDescuento
        : porcentajeMayorista;

    return (
      producto.precioBase +
      (producto.precioBase * porcentajeAplicable) / 100);

  }

  static calcularPrecioFinal(producto:Producto) {
    return CalculadorPrecioProducto.calcularPrecioMayorista(
        producto,
        producto.preciosMayorista?.[0] // ej: MAYORISTA_1
      );
    
  }

  static calcularPrecioNormal(producto:Producto) {
    return producto.precioBase +
        (producto.precioBase * producto.preciosMayorista?.[0]?.porcentaje || 0) / 100;// ej: MAYORISTA_1
  }

  static tienePromocion(producto:Producto) {
    return !!producto.porcentajeDescuento && producto.porcentajeDescuento > 0;
    
  }

  static calcularPreciosPorEscala(producto: Producto): { nivel: string, precio: number }[] {
    // Tomamos solo los primeros 3 precios mayoristas (Nivel 1, 2 y 3)
    // Usamos map para transformar cada MayoristaPrecio en un objeto { nivel, precio }
    return producto.preciosMayorista.slice(0, 3).map((mayorista, index) => {
      let nivelNumber = index + 1; 
      return {
        nivel: `nivel ${nivelNumber}`, // index 0 es nivel 1, index 1 es nivel 2..
        // Reutilizamos el métodoque ya sabe manejar descuentos y porcentajes
        precio: CalculadorPrecioProducto.calcularPrecioMayorista(producto, mayorista)
      };
    });
  }

  



}

