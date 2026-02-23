import { Combo } from "../entities/Combo";

export class ComboCalculador {

  static precioTotal(combo: Combo): number {
    return combo.items.reduce(
      (total, item) => total + item.precioUnitario * item.cantidad,
      0
    );
  }

  static pesoTotalGramos(combo: Combo): number {
    return combo.items.reduce(
      (total, item) =>
        total + (item.pesoGramos ?? 0) * item.cantidad,
      0
    );
  }

  static calcularPreciosPorEscala(combo: Combo): { nivel: number, precio: number }[] {
    // Calculamos el precio único del combo
    const precioUnico = ComboCalculador.precioTotal(combo);
    
    // Devolvemos el mismo precio para los 3 niveles
    return [
      { nivel: 1, precio: precioUnico },
      { nivel: 2, precio: precioUnico },
      { nivel: 3, precio: precioUnico }
    ];
  }
  
}