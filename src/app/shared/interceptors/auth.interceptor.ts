import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  let authSvc = inject(AuthenticationService);
  if (authSvc.isAuthenticated()) {
    const clone = request.clone({
      headers: request.headers.set(
        'Authorization',
        'Bearer ' + authSvc.authData?.token
      ),
    });
    return next(clone);
  } else {
    return next(request);
  }
};
