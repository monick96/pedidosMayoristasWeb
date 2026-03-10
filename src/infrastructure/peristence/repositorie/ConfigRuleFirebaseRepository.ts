import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { ConfigRuleRepositoryPort } from "../../../aplication/ports/ConfigRuleRepositoryPort";
import { AppRuleConfig } from "../../../domain/entities/AppRuleConfig";
import { fail, ok, Result } from "../../../shared/Result";
import { environment } from '../../../environments/environment.development';

export class ConfigRuleFirebaseRepository implements ConfigRuleRepositoryPort {
  
  constructor(private firestore: Firestore) {}

  // Guardaremos esto en la colección "sistema", documento "configuracion"
  private readonly DOC_REF = environment.firebase.coleccionSistema +'/'+ environment.firebase.docConfig;

  async getConfig(): Promise<Result<AppRuleConfig>> {
    try {
      const docRef = doc(this.firestore, this.DOC_REF);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return ok(docSnap.data() as AppRuleConfig);
      } else {
        // Si no existe en Firebase, devolvemos los valores por defecto 
       const defaultConfig: AppRuleConfig = {
          minimoGeneral: 290000,
          minimoConCombos: 490000,
          telefonoWhatsapp:'5491123456789',
          escalas: [
            { nivel: "nivel 1", nombre: 'Mayorista 1', montoMinimo: 0 },
            { nivel: "nivel 2", nombre: 'Mayorista 2', montoMinimo: 490000 },
            { nivel: "nivel 3", nombre: 'Mayorista 3', montoMinimo: 1200000 },
            { nivel: "nivel 4 ", nombre: 'Mayorista 4', montoMinimo: 2000000 }
          ]
        };
        // Lo creamos en Firebase porque no existía
        await setDoc(docRef, defaultConfig);

        //Devolvemos los datos para que la app siga funcionando sin interrupciones
        return ok(defaultConfig);
      }
    } catch (error) {
      console.error("Error obteniendo configuración:", error);
      return fail(error as Error);
    }
  }

  async updateConfig(config: AppRuleConfig): Promise<Result<void>> {
    try {
      const docRef = doc(this.firestore, this.DOC_REF);
      // Usamos merge: true para no borrar otros datos del sistema si los hubiera
      await setDoc(docRef, config, { merge: true });
      return ok(undefined);
    } catch (error) {
      console.error("Error guardando configuración:", error);
      return fail(error as Error);
    }
  }
}