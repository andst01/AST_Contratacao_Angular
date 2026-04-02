import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap, take } from 'rxjs/operators';

export const customAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const oidcSecurityService = inject(OidcSecurityService);

  // Pegamos o token atual da biblioteca
  return oidcSecurityService.getAccessToken().pipe(
  
    take(1),
    switchMap((token) => {
      // Se tivermos um token, clonamos a requisição e adicionamos o Header
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(authReq);
      }

      // Se não houver token, a requisição segue normal
      return next(req);
    })
  );
};
