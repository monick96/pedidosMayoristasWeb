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
}