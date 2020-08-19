import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';

@Injectable()
export class ApiInInterceptor implements HttpInterceptor {

  public router: Router;

  constructor(
    private injector: Injector,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.router = this.injector.get(Router);


    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          if (event instanceof HttpErrorResponse) {
              switch (event.status) {
                case 400: // Bad request!
                  // TODO
                  break;

                case 401:
                  localStorage.removeItem('token');
                  this.router.navigate(['/signin']);
                  break;

                case 403: // Forbidden.
                  // TODO
                  break;

                case 404: // Not found!
                  // TODO
                  break;

                case 500: // Internal Server Error!
                  // TODO
                  break;

                default:
                  break;
              }

          }
          return event;
      })
    );

  }

}
