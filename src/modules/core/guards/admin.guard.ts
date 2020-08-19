import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { UsersService } from '@core/services/users.service';


@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAdmin = (localStorage.getItem('isAdmin') == 'true');

    if (isAdmin) {
      return true;
    }

    // alert("Não tem acesso a esta página!");

    window.location.href = `/landing/forbidden`;

    return false;
  }
}
