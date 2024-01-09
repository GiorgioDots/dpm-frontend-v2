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
    if (!request.headers.has('SILENT_CALL')) {
      this._loading.setLoading(true, request.url);
    }
    return next.handle(request).pipe(
      finalize(() => {
        if (!request.headers.has('SILENT_CALL')) {
          this._loading.setLoading(false, request.url);
        }
      })
    );
  }
}
