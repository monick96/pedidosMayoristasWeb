import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth, getAuth } from '@angular/fire/auth';

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
import { productComposition, updateProductoComposition, updateProductoUnidadesComposition } from '../../composition/ProductoComposition';
import { GetCombosUseCase } from '../../aplication/use-cases/GetCombosUseCase';
import { comboComposition, updateComboComposition } from '../../composition/ComboComposition';
import { GetConfigRuleUseCase } from '../../aplication/use-cases/GetConfigRuleUseCase';
import { getConfigRuleComposition, updateRuleConfigComposition } from '../../composition/ConfigRuleComposition';
import { UpdateRuleConfigUseCase } from '../../aplication/use-cases/UpdateRuleConfigUseCase';
import { UpdateProductoActivoUseCase } from '../../aplication/use-cases/UpdateProductoActivoUseCase';
import { UpdateProductoUnidadesUseCase } from '../../aplication/use-cases/UpdateProductoUnidadesUseCase';
import { UpdateComboActivoUseCase } from '../../aplication/use-cases/UpdateComboActivoUseCase';

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
    provideAuth(() => getAuth()),
    {
      provide: GetProductosUseCase, // Cuando alguien pida el UseCase...
      useFactory: () => { 
        const firestore = inject(Firestore);
        return productComposition(firestore); 
      },
      deps: [Firestore] // Le decimos a Angular que le pase Firestore a la fábrica
    },
    {
      provide: GetCombosUseCase, 
      useFactory: () => { 
        const firestore = inject(Firestore);
        return comboComposition(firestore) 
      },
      deps: [Firestore]
    },
    {
      provide: GetConfigRuleUseCase, 
      useFactory: () => { 
        const firestore = inject(Firestore);
        return getConfigRuleComposition(firestore);
      },
      deps: [Firestore] 
    },
    {
      provide: UpdateRuleConfigUseCase, 
      useFactory: () => { 
        const firestore = inject(Firestore);
        return updateRuleConfigComposition(firestore);
      },
      deps: [Firestore] 
    },
    {
      provide: UpdateProductoActivoUseCase, 
      useFactory: () => { 
        const firestore = inject(Firestore);
        return updateProductoComposition(firestore);
      },
      deps: [Firestore]
    },
    {
      provide: UpdateProductoUnidadesUseCase, 
      useFactory: () => { 
        const firestore = inject(Firestore);
        return updateProductoUnidadesComposition(firestore);
      },
      deps: [Firestore]
    },
    {
      provide: UpdateComboActivoUseCase, 
      useFactory: () => { 
        const firestore = inject(Firestore);
        return updateComboComposition(firestore);
      },
      deps: [Firestore]
    },
  ]
};
