import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment'; // Importe o moment

export const datasApoliceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

 
  const inicio = control.get('dataInicioVigencia')?.value;
  const fim = control.get('dataFimVigencia')?.value;

  // Se a data de fim for nula ou não estiver preenchida, a validação é VÁLIDA
  if (!inicio || !fim) {
    return null;
  }

  const mInicio = moment(inicio);
  const mFim = moment(fim);

  // Se a data de início for após a data de fim, retorna o erro
  if (mInicio.isAfter(mFim)) {
    return { dataInvalida: true };
  }

  return null;
};
