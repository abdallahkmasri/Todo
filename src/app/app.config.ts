import { ApplicationConfig } from '@angular/core';
import { AppRoutingProvider } from './app.routes';
import {
  provideAnimations,
} from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TodoInterceptor } from './components/utils/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    ...AppRoutingProvider,
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TodoInterceptor,
      multi: true
    },
    provideAnimations(),
    provideHttpClient(),
  ],
};
