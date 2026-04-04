import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../config/environment';
import { Observable } from 'rxjs';
import { Proposta } from '../../features/proposta/models/Proposta';

@Injectable({ providedIn: 'root' })
export class PropostaService {
  private api = environment.apiProposta;

  constructor(private http: HttpClient) {}

  listarComFiltro(filtro: any): Observable<Proposta[]> {
    let params = new HttpParams()
      .set('dataCriacao', filtro.dataCriacao || '')
      .set('numeroProposta', filtro.numeroProposta || '')
      .set('status', filtro.status || '-1');

    return this.http.get<Proposta[]>(`${this.api}/ObterTodosComFiltro`, { params });
  }

  listar(): Observable<Proposta[]> {
    return this.http.get<Proposta[]>(`${this.api}/ObterDadosPropostaCliente`);
  }

  obterPorId(id: number): Observable<Proposta> {
    return this.http.get<Proposta>(`${this.api}/ObterPropostaClientePorId/${id}`);
  }

  excluir(id: number): Observable<number> {
    return this.http.delete<number>(`${this.api}/Excluir/${id}`);
  }

  criar(proposta: Proposta): Observable<Proposta> {
    return this.http.post<Proposta>(`${this.api}/Novo`, proposta);
  }

  atualizar(proposta: Proposta): Observable<Proposta> {
    return this.http.put<Proposta>(`${this.api}/Atualizar`, proposta);
  }

  salvar(proposta: Proposta): Observable<Proposta> {
   
    if (proposta.id > 0) return this.atualizar(proposta);
    else return this.criar(proposta);
  }
}
