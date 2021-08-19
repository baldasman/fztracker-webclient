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
        console.log('check inst', data);

        /* {
          "session": {
              "authId": "moreira.sousa@marinha.pt",
              "externalId": "M9830401",
              "sessionId": "eaaa9960-002d-11ec-9156-392ed392e5ce",
              "sessionType": "portal",
              "numberOfLogins": 1,
              "lastLoginDate": 1629295775,
              "ttl": 172800,
              "createdAt": 1629295775,
              "iat": 1629295775
          },
          "user": {
              "name": "SAJ FZ Moreira de Sousa",
              "isAdmin": true,
              "acessRank": false,
              "isUser": false
          }
      } */


       /*  if (data?.user?.isAdmin == true) {
          return true;
        }

        const serial : string = data?.session?.externalId || '';

        // check if serial 2 char is a letter 
        if (serial && serial.length > 1 && serial[1] === 'X') {
          return true;
        } */

        if (data?.user?.isUser == true) {
          return true;
        }

        console.log('not inst => GO HOME!!!!');
        this.router.navigateByUrl('/not-found');
        return false;
      }),
      catchError(() => {
        this.router.navigateByUrl('/not-found');
        return of(false);
      })
    );
  }
}
