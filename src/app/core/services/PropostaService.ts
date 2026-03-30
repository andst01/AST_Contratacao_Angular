import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from "../../config/environment";
import { Observable } from 'rxjs';
import { Proposta } from '../../features/proposta/models/Proposta';

@Injectable({ providedIn: 'root' })
export class PropostaService{

  private  api = environment.apiProposta;

  constructor(private http: HttpClient){}

  listar():Observable<Proposta[]>{
    return this.http.get<Proposta[]>(`${this.api}/ObterDadosPropostaCliente`)
  }

  obterPorId(id: number):Observable<Proposta>{
    return this.http.get<Proposta>(`${this.api}/ObterPropostaClientePorId/${id}`);
  }

}
