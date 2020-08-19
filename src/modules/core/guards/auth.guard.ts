import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { UsersService } from '@core/services/users.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private location: Location, private router: Router,
      private t: TranslateService, private usersService: UsersService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let token = null;

    if (route.queryParams['token']) {
      // get token from query params and set to local storage
      token = route.queryParams['token'];
      localStorage.setItem('token', token);
    } else {
      // get token from local storage
      token = localStorage.getItem('token');
    }

    if (token) {
      const decoded =JSON.parse(atob(token.split('.')[1])); 
      
      return this.usersService.getUser({authId: decoded.authId})
          .pipe(
              map(response => {
                if (<Boolean>response['data'].isActive) {
                  this.t.use(response['data'].languageKey);
                  return true;
                }

                token = null;
                window.location.href = `/signin`;
              }),
              catchError(() => {
                token = null;
                window.location.href = `/signin`;
                return of(false);
              }));
    }

    window.location.href = `/signin`;

    return false;
  }
}
