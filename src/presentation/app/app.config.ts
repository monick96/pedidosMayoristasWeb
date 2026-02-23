import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR'; // o es-AR, es-ES, etc.
// español de Argentina con punto para miles
// localeEsAr usa punto para miles y coma para decimales
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeEsAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es-AR' },
  ]
};
