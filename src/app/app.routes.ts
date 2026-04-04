import { PropostaFormComponent } from './features/proposta/form/proposta-form-component/proposta-form-component';
import { Routes } from '@angular/router';
import { ListaApoliceComponent } from './features/apolice/list/lista-apolice-component/lista-apolice-component';
import { ApoliceFormComponent } from './features/apolice/form/apolice-form-component/apolice-form-component';
import { CallbackComponent } from './features/callback/callback-component/callback-component';
import { ListaPropostaComponent } from './features/proposta/list/lista-proposta-component/lista-proposta-component';

export const routes: Routes = [
  { path: 'auth-callback', component: CallbackComponent },
 { path: '', redirectTo: 'auth-callback', pathMatch: 'full' },
  { path: 'apolice', component: ListaApoliceComponent },
  { path: 'apolice/novo', component: ApoliceFormComponent },
  { path: 'apolice/editar/:id', component: ApoliceFormComponent },
  { path: 'proposta', component: ListaPropostaComponent },
  { path: 'proposta/novo', component: PropostaFormComponent },
  { path: 'proposta/editar/:id', component: PropostaFormComponent },
   { path: '**', redirectTo: 'auth-callback' },
];
