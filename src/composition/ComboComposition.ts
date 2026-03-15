import { GetCombosUseCase } from "../aplication/use-cases/GetCombosUseCase";
import { UpdateComboActivoUseCase } from "../aplication/use-cases/UpdateComboActivoUseCase";
import { ComboFirebaseRepository } from "../infrastructure/peristence/repositorie/ComboFirebaseRepository";
import { Firestore } from '@angular/fire/firestore';

export function comboComposition(firestoreDb: Firestore): GetCombosUseCase {
  const repository = new ComboFirebaseRepository(firestoreDb);
  return new GetCombosUseCase(repository);
}

export function updateComboComposition(firestoreDb: Firestore): UpdateComboActivoUseCase {
  const repository = new ComboFirebaseRepository(firestoreDb);
  return new UpdateComboActivoUseCase(repository);
}