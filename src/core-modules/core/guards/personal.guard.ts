import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class PersonalGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // If a 'token' exists Will try to decode session based on that token.
    return this.authenticationService.getSession().pipe(map(
      data => {
        console.log('check peronal', `M${route.params.serial}`, data?.user?.isAdmin, data?.session?.externalId);

        if (data?.user?.isAdmin == true) {
          return true;
        }

        // compare session.serial with param.serial
        if (`M${route.params.serial}` === data?.session?.externalId) {
          return true;
        }

        console.log('not person in session => GO HOME!!!!');
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
