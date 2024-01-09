import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { catchError, finalize, map, tap } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private _loading: LoadingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let isSilent = true;
    if (!request.headers.has('SILENT_CALL')) {
      this._loading.setLoading(true, request.url);
      isSilent = false;
    }
    let copy = request.clone({
      headers: request.headers.delete('SILENT_CALL'),
    });
    return next.handle(copy).pipe(
      finalize(() => {
        if (!isSilent) {
          this._loading.setLoading(false, request.url);
        }
      })
    );
  }
}
