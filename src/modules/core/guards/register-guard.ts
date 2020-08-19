import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { EnvironmentService } from '@core/services/environment.service';

@Injectable()
export class RegisterGuard implements CanActivate {

  constructor(
    private environmentService: EnvironmentService,
    private router: Router
  ) { }

  canActivate() {
    if (this.environmentService.getConfiguration('userRegisterMethod') === 'disabled') {
      this.router.navigate(['/signin']);
    }
    return true;
  }
}
