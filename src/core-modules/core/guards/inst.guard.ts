import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class InstGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // If a 'token' exists Will try to decode session based on that token.
    return this.authenticationService.getSession().pipe(map(
      data => {
        console.log('check inst', data?.user?.isAdmin, data?.session?.externalId);

        if (data?.user?.isAdmin == true) {
          return true;
        }

        const serial : string = data?.session?.externalId || '';

        // check if serial 2 char is a letter 
        if (serial && serial.length > 1 && serial[1] === 'X') {
          return true;
        }

        console.log('not inst => GO HOME!!!!');
        this.router.navigateByUrl('/');
        return false;
      }),
      catchError(() => {
        this.router.navigateByUrl('/');
        return of(false);
      })
    );
  }
}
