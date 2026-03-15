import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './presentation/app/app.config';
import { App } from './presentation/app/app';

import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR'; // Español argentino
// o usa es-CL, es-ES según prefieras

registerLocaleData(localeEsAr);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
