import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './features/navbar/navbar-component/navbar-component';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  standalone: true,
  template: `
    <app-navbar-component></app-navbar-component>

    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  /*templateUrl: './app.html', */
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, errorMessage }) => {
      debugger;
      if (isAuthenticated) {
        console.log('Usuário autenticado com sucesso!');
      } else {
        // Se não houver erro e não estiver autenticado, aí sim redireciona.
        // Isso evita tentar logar novamente se o IdentityServer retornar um erro real.
        if (!errorMessage) {
          console.log('Iniciando redirecionamento para login...');
          this.oidcSecurityService.authorize();
        } else {
          console.error('Erro na autenticação:', errorMessage);
        }
      }
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
//export class App {
//protected readonly title = signal('apolice-angular');
//}
