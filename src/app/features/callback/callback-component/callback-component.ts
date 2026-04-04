import { Component, effect, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from '../../../core/services/AuthService';

@Component({
  selector: 'app-callback-component',
  imports: [],
  templateUrl: './callback-component.html',
  styleUrl: './callback-component.css',
})
export class CallbackComponent  {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.loggedIn()) {
        console.log('Login detectado, redirecionando para apolice...');
        this.router.navigate(['/apolice']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

}
