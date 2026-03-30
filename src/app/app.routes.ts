import { Routes } from '@angular/router';
import { ListaApoliceComponent } from './features/apolice/list/lista-apolice-component/lista-apolice-component';
import { ApoliceFormComponent } from './features/apolice/form/apolice-form-component/apolice-form-component';

export const routes: Routes = [

   { path: '', redirectTo: 'apolice', pathMatch: 'full' },

  { path: 'apolice', component: ListaApoliceComponent },
  { path: 'apolice/novo', component: ApoliceFormComponent },
  { path: 'apolice/editar/:id', component: ApoliceFormComponent },

  { path: '**', redirectTo: 'apolice' }
];
