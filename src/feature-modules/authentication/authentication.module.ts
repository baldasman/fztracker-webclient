import { NgModule } from '@angular/core';

import { MainThemeModule } from '@core-modules/main-theme';
import { SharedModule } from '@core-modules/shared';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';

// Pages.
import { SignInComponent } from '@auth-feature-module/pages/sign-in/sign-in.component';
import { SignOutComponent } from '@auth-feature-module/pages/sign-out/sign-out.component';

// Services.
import { AuthenticationService } from '@auth-feature-module/services/authentication.service';

@NgModule({
  imports: [
    MainThemeModule,
    SharedModule,

    AuthenticationRoutingModule
  ],
  declarations: [
    AuthenticationComponent,

    // Pages.
    SignInComponent,
    SignOutComponent

  ],
  providers: [
    AuthenticationService
  ]
})
export class AuthenticationModule { }
