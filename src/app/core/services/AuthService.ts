import { Injectable, inject, signal } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly oidcSecurityService = inject(OidcSecurityService);
  public userProfile = signal<any>(null);
  public isAuthenticated = signal<boolean>(false);


  constructor() {
    // Subscrevemos uma vez para manter nossas propriedades sincronizadas
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {

     debugger;
      console.log(userData);
      this.isAuthenticated.set(isAuthenticated);
      this.userProfile.set(userData);
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {

    sessionStorage.clear();
    localStorage.clear();

    const currentAppUrl = window.location.origin;

    window.location.href = `https://localhost:5001/Account/ExternalLogout?returnUrl=${currentAppUrl}`;
    //this.oidcSecurityService.logoff().subscribe();
  }


}
