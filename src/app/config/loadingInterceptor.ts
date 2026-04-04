import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService} from 'ngx-spinner';
import { finalize } from 'rxjs';


export const loadingInterceptor: HttpInterceptorFn =(req, next) => {

  const spinner = inject(NgxSpinnerService);

  spinner.show(); // Liga o spinner da lib

  return next(req).pipe(
    finalize(() => {
      spinner.hide(); // Desliga quando a requisição terminar
    })
  );

}
