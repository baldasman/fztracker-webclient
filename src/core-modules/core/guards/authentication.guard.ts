import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    // If a 'token' queryParam exists, it's coming from external application. Will try to authenticate based on that token.
    if (route.queryParams.token) {
      return this.authenticationService.verifyToken(route.queryParams.token).pipe(map(
        token => {

          localStorage.setItem('token', token);

          const redirectTo = this.router.parseUrl(state.url);
          redirectTo.queryParams = {};
          this.router.navigateByUrl(redirectTo.toString());
          return true;

        }),
        catchError(() => {
          localStorage.removeItem('token');
          this.router.navigateByUrl('auth');
          return of(false);
        })
      );
    }

    if (localStorage.getItem('token')) {
      return this.authenticationService.verifySession().pipe(map(result => result),
        catchError(() => {
          localStorage.removeItem('token');
          this.router.navigateByUrl('auth');
          return of(false);
        })
      );
    }

    // If NO token is set...
    localStorage.setItem('referrer', state.url);
    this.router.navigateByUrl('auth');
    return of(false);

  }

}
