import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { NGXLogger } from 'ngx-logger';

import { Observable } from 'rxjs';
import { tap, retry } from 'rxjs/operators';

@Injectable()
export class ApiInInterceptor implements HttpInterceptor {

  private loggerContext = 'Core::ApiInInterceptor';

  constructor(
    private router: Router,
    private logger: NGXLogger
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        // this.logger.error(this.loggerContext, request, event); // TODO: algo se passa aqui!!!!
        if (event instanceof HttpResponse) {
          switch (event.status) {
            case 400: // Bad request!
              // TODO
              break;
            case 401:
              this.logger.error(this.loggerContext, '401 response');
              localStorage.removeItem('token');
              this.router.navigateByUrl('/auth');
              break;
            case 403: // Forbidden.
              this.router.navigate(['/forbidden']);
              break;
            case 404: // Not found!
              // TODO
              break;
            case 409: // Not found!
              // TODO
              break;
            case 500: // Internal Server Error!
              // TODO
              break;
            default:
              break;
          }
        }
      })
    );
  }
}
