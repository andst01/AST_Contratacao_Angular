import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService{

  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: ['toast-success'], // Classe CSS para cor verde
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  error(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['toast-error'], // Classe CSS para cor vermelha
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

}
