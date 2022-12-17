import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MessagesService } from '../services/messages.service';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  constructor(private messagesSvc: MessagesService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        console.log(error);
        if (error.error instanceof ErrorEvent) {
          console.log('This is client side error');
          errorMsg = `Error: ${error.error.message}`;
        } else {
          console.log('This is server side error');
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        if (error.error?.message != undefined) {
          errorMsg = error.error.message;
        }
        this.messagesSvc.pushErrorMessage(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
