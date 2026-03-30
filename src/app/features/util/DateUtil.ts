export class DateUtil {
  static formatarParaApi(data: Date): string | null {
    if (!data) return null;

    if (data instanceof Date) {
      return data.toISOString();
    }

    // se vier string, converte
    return new Date(data).toISOString();
  }
  static converterParaDate(data: string): Date | null {
    return data ? new Date(data) : null;
  }
}
