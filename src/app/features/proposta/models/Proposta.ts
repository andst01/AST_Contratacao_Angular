import { Mensagem } from "../../Mensagem";

export interface Proposta{
    id: number,
    numeroProposta: string,
    tipoSeguro: string,
    dataCriacao: string,
    dataValidade: string | null,
    premio: number,
    valorCobertura: number,
    formaPagamento: string,
    quantidadeParcelas: number | null,
    canalVenda: string,
    observacoes: string | null,
    idCliente: number,
    nomeCliente: string | null,
    codigoStatus: number,
    status: string,
    nomeClienteCpf: string | null,
    mensagem: Mensagem | null
}
