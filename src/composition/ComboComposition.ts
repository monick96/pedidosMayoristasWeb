import { GetCombosUseCase } from "../aplication/use-cases/GetCombosUseCase";
import { ComboFirebaseRepository } from "../infrastructure/peristence/repositorie/ComboFirebaseRepository";
import { Firestore } from '@angular/fire/firestore';

export function comboComposition(firestoreDb: Firestore): GetCombosUseCase {
  const repository = new ComboFirebaseRepository(firestoreDb);
  return new GetCombosUseCase(repository);
}