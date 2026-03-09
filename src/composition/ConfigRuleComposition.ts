import { GetConfigRuleUseCase } from "../aplication/use-cases/GetConfigRuleUseCase";
import { UpdateRuleConfigUseCase } from "../aplication/use-cases/UpdateRuleConfigUseCase";
import { ConfigRuleFirebaseRepository } from "../infrastructure/peristence/repositorie/ConfigRuleFirebaseRepository";
import { Firestore } from '@angular/fire/firestore';

export function getConfigRuleComposition(firestore: Firestore): GetConfigRuleUseCase {
  return new GetConfigRuleUseCase(new ConfigRuleFirebaseRepository(firestore));
}

export function updateRuleConfigComposition(firestore: Firestore): UpdateRuleConfigUseCase {
  return new UpdateRuleConfigUseCase(new ConfigRuleFirebaseRepository(firestore));
}