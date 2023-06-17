import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { MessagesService } from '../services/messages.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const maxRetries = 2;
export const delayMs = 2000;

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  constructor(private messagesSvc: MessagesService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        let anyError = error.error as any;
        if (anyError.errors != undefined) {
          for (let err of anyError.errors) {
            this.messagesSvc.pushErrorMessage(err.msg);
          }
          return throwError(error.error);
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
          this.messagesSvc.pushErrorMessage(errorMsg);
          return throwError(errorMsg);
        }
      })
    );
  }
}
