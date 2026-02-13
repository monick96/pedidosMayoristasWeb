import { CartItem } from "../../../domain/entities/CartItem";

export class CartLocalStorageRepository {
  private readonly KEY = 'mayorista_cart_v1';

  save(items: CartItem[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(items));
  }

  load(): CartItem[] {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  }
  
  clear(): void {
    localStorage.removeItem(this.KEY);
  }
}