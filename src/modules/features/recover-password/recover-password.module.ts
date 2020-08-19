import { NgModule } from '@angular/core';

import { RecoverPasswordRoutingModule } from '@recover/recover-password-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { RecoverPasswordComponent } from '@recover/recover-password.component';

import { FormsService } from '@shared/catalog/forms/services/forms.service';
import { LoaderService } from '@shared/catalog/loader/services/loader.service';
import { RecoverPasswordService } from './services/recover-password.service';

import { ConfigurationsListGuard } from '@core/guards/configurations.guard';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    RecoverPasswordComponent
  ],
  imports: [
    RecoverPasswordRoutingModule,
    SharedModule
  ],
  providers: [
    ConfigurationsListGuard,
    FormsService,
    LoaderService,
    RecoverPasswordService
  ]
})

export class RecoverPasswordModule {
}
