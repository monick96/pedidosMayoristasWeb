import { CartItem } from "../../domain/entities/CartItem";
import { Result } from "../../shared/Result";

export interface CartRepositoryPort {

  save(items: CartItem[]): Result<void>;

  load(): Result<CartItem[]>;
  
  clear(): Result<void>;
}