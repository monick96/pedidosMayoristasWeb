import { CartRepositoryPort } from "../aplication/ports/CartRepositoryPort";
import { CartLocalStorageRepository } from "../infrastructure/peristence/local-storage/CartLocalStorageRepository";

export function cartRepositoryComposition(): CartRepositoryPort {
  return new CartLocalStorageRepository();
}