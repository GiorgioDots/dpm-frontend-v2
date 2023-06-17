import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.authSvc.isAuthenticated()) {
      // request.headers.append(
      //   'Authorization',
      //   'Bearer ' + this.authSvc.authData?.Token
      // );
      const clone = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + this.authSvc.authData?.token
        ),
      });
      return next.handle(clone);
    } else {
      return next.handle(request);
    }
  }
}
