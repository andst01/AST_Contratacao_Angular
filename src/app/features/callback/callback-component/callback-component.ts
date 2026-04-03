import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from '../../../core/services/AuthService';

@Component({
  selector: 'app-callback-component',
  imports: [],
  templateUrl: './callback-component.html',
  styleUrl: './callback-component.css',
})
export class CallbackComponent {

  constructor(private authService: AuthService,
              private router: Router){}

  ngOnInit() {

    this.authService.checkAuth().subscribe(({ isAuthenticated }) => {
      if (isAuthenticated) {
        this.router.navigate(['/apolice']);
      } else {
        this.router.navigate(['/']);
      }
    });

  }

}
