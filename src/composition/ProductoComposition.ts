import { GetProductosUseCase } from "../aplication/use-cases/GetProductosUseCase";
import { ProductoFirebaseRepository } from "../infrastructure/peristence/repositorie/ProductoFirebaseRepository";
import { Firestore } from '@angular/fire/firestore';

export function productComposition(firestoreDb: Firestore): GetProductosUseCase {

  const repository = new ProductoFirebaseRepository(firestoreDb);
  return new GetProductosUseCase(repository);
}