import { ApplicationConfig, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
//import 'moment/locale/pt-br';
import { provideAuth, LogLevel, OidcSecurityService } from 'angular-auth-oidc-client';
import { customAuthInterceptor } from './config/customAuthInterceptor';
import { APP_INITIALIZER } from '@angular/core';
import { loadingInterceptor } from './config/loadingInterceptor';

export const appConfig: ApplicationConfig = {

  providers: [
    provideHttpClient(
      withInterceptors([customAuthInterceptor, loadingInterceptor]),
      withInterceptorsFromDi()
       // Seu interceptor aqui
    ),
    /*{
      provide: APP_INITIALIZER,
      useFactory: (oidcSecurityService: OidcSecurityService) => () =>
        oidcSecurityService.checkAuth(), // O Angular espera essa Promise/Observable resolver
      deps: [OidcSecurityService],
      multi: true,
    }, */
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },

    provideAuth({
      config: {
        authority: 'https://localhost:5001',
        redirectUrl: 'http://localhost:4200/auth-callback',
        postLogoutRedirectUri: 'http://localhost:4200/',
        clientId: 'angular',
        scope: 'openid profile roles offline_access api1',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
      },
    }),
  ]
};

