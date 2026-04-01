import { ApplicationConfig, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import 'moment/locale/pt-br';
import { provideAuth, LogLevel } from 'angular-auth-oidc-client';
import { customAuthInterceptor } from './config/customAuthInterceptor';

export const appConfig: ApplicationConfig = {

  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideHttpClient(
      withInterceptors([customAuthInterceptor]) // Seu interceptor aqui
    ),
    provideAuth({
      config: {
        authority: 'https://localhost:5001',
        redirectUrl: window.location.origin + '/auth-callback',
        postLogoutRedirectUri: window.location.origin,
        clientId: 'angular',
        scope: 'openid profile offline_access roles api1',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.None,
      },
    }),
  ]
};
