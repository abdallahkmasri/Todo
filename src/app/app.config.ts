import { ApplicationConfig } from '@angular/core';
import { AppRoutingProvider } from './app.routes';
import {
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    ...AppRoutingProvider,
    provideAnimations(),
    provideHttpClient(),
  ],
};
