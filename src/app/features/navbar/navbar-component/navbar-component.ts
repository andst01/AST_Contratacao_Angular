import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/AuthService';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  get nomeUsuario(): string {

    const profile = this.authService.userProfile(); // Chama o signal
    return profile?.name || profile?.preferred_username || profile?.given_n
  }

  handleLogout(): void {
    this.authService.logout();
  }
}
