import { GetProductosUseCase } from "../aplication/use-cases/GetProductosUseCase";
import { UpdateProductoActivoUseCase } from "../aplication/use-cases/UpdateProductoActivoUseCase";
import { UpdateProductoUnidadesUseCase } from "../aplication/use-cases/UpdateProductoUnidadesUseCase";
import { ProductoFirebaseRepository } from "../infrastructure/peristence/repositorie/ProductoFirebaseRepository";
import { Firestore } from '@angular/fire/firestore';

export function productComposition(firestoreDb: Firestore): GetProductosUseCase {

  const repository = new ProductoFirebaseRepository(firestoreDb);
  return new GetProductosUseCase(repository);
}

export function updateProductoComposition(firestoreDb: Firestore): UpdateProductoActivoUseCase {
  const repository = new ProductoFirebaseRepository(firestoreDb);
  return new UpdateProductoActivoUseCase(repository);
}

export function updateProductoUnidadesComposition(firestoreDb: Firestore): UpdateProductoUnidadesUseCase {
  const repository = new ProductoFirebaseRepository(firestoreDb);
  return new UpdateProductoUnidadesUseCase(repository);
}