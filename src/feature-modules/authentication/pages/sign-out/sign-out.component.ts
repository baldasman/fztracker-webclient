import { Component } from '@angular/core';
import { Core } from '@app/base';

import { AuthenticationService } from '@auth-feature-module/services/authentication.service';
import { take } from 'rxjs/operators';

@Component({ template: '' })
export class SignOutComponent extends Core {

  constructor(
    private readonly authenticationService: AuthenticationService
  ) {
    super();

    this.authenticationService.signOut().pipe(take(1)).subscribe(
      () => {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/auth/signin');
      },
      () => {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/auth/signin');
      });

  }

}
