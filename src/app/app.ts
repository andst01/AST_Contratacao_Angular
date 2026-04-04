import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './features/navbar/navbar-component/navbar-component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from './core/services/AuthService';
import { NgxSpinnerComponent } from "ngx-spinner";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgxSpinnerComponent],
  standalone: true,
  template: `
    <app-navbar-component></app-navbar-component>
    <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="medium"
      color="#fff"
      type="ball-furg-rotate"
      [fullScreen]="true">
      <p style="color: white; margin-top: 15px;"> Processando... </p>
    </ngx-spinner>

    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  /*templateUrl: './app.html', */
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly authService = inject(AuthService);
  isAuthenticated = false;
  userData: any = null;

  constructor(){}

 ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, errorMessage }) => {

      this.authService.updateState(isAuthenticated, userData);

      if (!isAuthenticated && !errorMessage && !window.location.pathname.includes('auth-callback')) {
        this.oidcSecurityService.authorize();
      }
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.authService.logout();
  }
}
//export class App {
//protected readonly title = signal('apolice-angular');
//}
