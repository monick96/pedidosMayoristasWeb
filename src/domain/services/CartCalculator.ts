import { CartItem } from "../entities/CartItem";

export class CartCalculator {
  //acc es el acumulador que va sumando el total
  static calculateTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  }
  
  static calculateTotalItems(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.cantidad, 0);
  }
}