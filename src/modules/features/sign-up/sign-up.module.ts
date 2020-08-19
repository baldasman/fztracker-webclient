import { NgModule } from '@angular/core';

import { RecaptchaModule } from 'ng-recaptcha';
import { SharedModule } from '@shared/shared.module';
import { SignUpRoutingModule } from '@sign-up/sign-up-routing.module';

import { ConfirmAccountComponent } from '@sign-up/pages/confirm-account/confirm-account.controller';
import { SignUpComponent } from '@sign-up/sign-up.component';
import { SignUpLayoutComponent } from '@sign-up/components/sign-up-layout/sign-up-layout.component';

import { ConfirmAccountService } from '@sign-up/services/confirm-account.service';
import { FormsService } from '@shared/catalog/forms/services/forms.service';
import { LoaderService } from '@shared/catalog/loader/services/loader.service';
import { SignInService } from '@features/sign-in/services/sign-in.service';
import { SignUpService } from '@sign-up/services/sign-up.service';

import { ConfigurationsListGuard } from '@core/guards/configurations.guard';
import { RegisterGuard } from '@core/guards/register-guard';

@NgModule({
  declarations: [
    ConfirmAccountComponent,
    SignUpComponent,
    SignUpLayoutComponent
  ],
  imports: [
    RecaptchaModule.forRoot(),
    SignUpRoutingModule,
    SharedModule
  ],
  providers: [
    ConfirmAccountService,
    ConfigurationsListGuard,
    FormsService,
    LoaderService,
    RegisterGuard,
    SignInService,
    SignUpService
  ]
})

export class SignUpModule {
}
