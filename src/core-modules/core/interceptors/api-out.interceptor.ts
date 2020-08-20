import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiOutInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': 'en',  // TODO: Improve possibility to send another language!
      }
    });

    if (localStorage.getItem('token')) {
      request = request.clone({ setHeaders: { authorization: `Bearer ${localStorage.getItem('token')}` } });
    }

    return next.handle(request);

  }

}
