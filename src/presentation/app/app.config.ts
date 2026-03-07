import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR'; // o es-AR, es-ES, etc.
// español de Argentina con punto para miles
// localeEsAr usa punto para miles y coma para decimales
import { LOCALE_ID } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { GetProductosUseCase } from '../../aplication/use-cases/GetProductosUseCase';
import { Firestore } from '@angular/fire/firestore';
import { productComposition } from '../../composition/ProductoComposition';
import { GetCombosUseCase } from '../../aplication/use-cases/GetCombosUseCase';
import { comboComposition } from '../../composition/ComboComposition';

registerLocaleData(localeEsAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es-AR' },
    //USAMOS LA VARIABLE DEL ENTORNO
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    {
      provide: GetProductosUseCase, // Cuando alguien pida el UseCase...
      useFactory: (firestore: Firestore) => { // ...Angular ejecutará esta fábrica
       return productComposition(firestore) // Le pasamos Firestore a la composición para que arme el caso de uso
      },
      deps: [Firestore] // Le decimos a Angular que le pase Firestore a la fábrica
    },
    {
      provide: GetCombosUseCase, 
      useFactory: (firestore: Firestore) => { 
       return comboComposition(firestore) 
      },
      deps: [Firestore]
    }
  ]
};
