import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { SignInRoutingModule } from '@sign-in/sign-in-routing.module';

import { SignInComponent } from '@sign-in/sign-in.component';

import { FormsService } from '@shared/catalog/forms/services/forms.service';
import { LoaderService } from '@shared/catalog/loader/services/loader.service';
import { SignInService } from '@sign-in/services/sign-in.service';

import { ConfigurationsListGuard } from '@core/guards/configurations.guard';

@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    SignInRoutingModule,
    SharedModule
  ],
  providers: [
    ConfigurationsListGuard,
    FormsService,
    LoaderService,
    SignInService
  ]
})

export class SignInModule {
}
