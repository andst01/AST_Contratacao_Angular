import { Injectable, OnInit, inject, signal } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService  {

  private readonly oidcSecurityService = inject(OidcSecurityService);
  public userProfile = signal<any>(null);
  public loggedIn = signal<boolean>(false);


  updateState(isAuthenticated: boolean, userData: any) {
    this.loggedIn.set(isAuthenticated);
    this.userProfile.set(userData);
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
