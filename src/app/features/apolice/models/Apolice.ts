import { Mensagem } from "../../Mensagem";

export interface Apolice {
    id: number,
    numeroApolice: string,
    idProposta: number,
    dataInicioVigencia: string,
    dataFimVigencia: string | null,
    premioFinal: number,
    valorCobertura: number,
    formaPagamento: string,
    quantidadeParcelas: number,
    dataContratacao: string,
    codigoStatus: number,
    status: string,
    numeroProposta: string | null,
    nomeCliente: string | null,
    mensagem: Mensagem | null
}
