import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../config/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Cliente } from '../../features/cliente/models/Cliente';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  constructor(private http: HttpClient) {}

  private api = environment.apiCliente;

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.api}/ObterTodos/`);
  }

  obterPorId(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.api}/Obter/${id}`);
  }

}
