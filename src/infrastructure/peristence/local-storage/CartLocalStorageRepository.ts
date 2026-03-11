import { CartRepositoryPort } from "../../../aplication/ports/CartRepositoryPort";
import { STORAGE_KEYS } from "../../../constantes/constantes";
import { CartItem } from "../../../domain/entities/CartItem";
import { fail, ok, Result } from "../../../shared/Result";

export class CartLocalStorageRepository implements CartRepositoryPort {
  private readonly KEY = STORAGE_KEYS.CART;

  save(items: CartItem[]): Result<void> {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
      return ok<void>(undefined);
    } catch (error) {
      return fail<void>(error as Error);
    }
  }

  load(): Result<CartItem[]> {
    try {
      const data = localStorage.getItem(this.KEY);
      const items = data ? JSON.parse(data) : [];
      return ok<CartItem[]>(items);
    } catch (error) {
      return fail<CartItem[]>(error as Error);
    }
  }
  
  clear(): Result<void> {
    try {
      localStorage.removeItem(this.KEY);
      return ok<void>(undefined);
    } catch (error) {
      return fail<void>(error as Error);
    }
  }

  
}