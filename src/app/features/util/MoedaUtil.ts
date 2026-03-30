export class MoedaUtil {

  static formatarMoeda(valor?: number | null) {
    if (!valor) return "";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }

  static parseMoeda(valor: string) {
    const numeros = valor.replace(/\D/g, "");
    return numeros ? Number(numeros) / 100 : 0;
  }

}
