import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../config/environment';
import { Apolice } from '../../features/apolice/models/Apolice';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApoliceService {

private api = environment.apiApolice;

  constructor(private http: HttpClient) {}

  listarComFiltro(filtro: any): Observable<Apolice[]> {

    let params = new HttpParams()
      .set('dataContratacao', filtro.dataContratacao || '')
      .set('numeroApolice', filtro.numeroApolice || '')
      .set('status', filtro.status || '');

    return this.http.get<Apolice[]>(
      `${this.api}/ObterTodosComFiltro`,
      { params }
    );
  }

   obterPorId(id: number): Observable<Apolice> {
    return this.http.get<Apolice>(
      `${this.api}/ObterContratacaoPropostaClientePorId/${id}`
    );
  }

  criar(apolice: Apolice): Observable<Apolice> {
    return this.http.post<Apolice>(`${this.api}/Novo`, apolice);
  }

  atualizar(apolice: Apolice): Observable<Apolice> {
    return this.http.put<Apolice>(`${this.api}/Atualizar`, apolice);
  }

  excluir(id: number): Observable<number>{
    return this.http.delete<number>(`${this.api}/Excluir/${id}`);
  }

  salvar(apolice: Apolice): Observable<Apolice> {
    
    if(apolice.id > 0) return this.atualizar(apolice)
    else return this.criar(apolice);
  }

}
