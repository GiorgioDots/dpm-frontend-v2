import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { MessageAdapterService } from '../services/message-adapter.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  let messageSvc = inject(MessageAdapterService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let anyError = error.error as any;
      let message : Message = {severity: 'error', summary: 'Error'};
      if (anyError.errors != undefined) {
        for (let err of anyError.errors) {
          message.detail = err.msg;
        }
        return throwError(() => error.error);
      } else {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 401:
              errorMsg = 'Unauthorized';
              break;
            default:
              errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
              break;
          }
        }
        if (error.error?.message != undefined) {
          errorMsg = error.error.message;
        }
        message.detail = errorMsg;
        messageSvc.next(message)
        return throwError(() => errorMsg);
      }
    })
  );
};
