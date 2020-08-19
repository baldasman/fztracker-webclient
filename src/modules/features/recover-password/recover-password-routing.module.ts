import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordComponent } from '@recover/pages/change-password/change-password.component';
import { RecoverPasswordComponent } from '@recover/recover-password.component';

import { ConfigurationsListGuard } from '@core/guards/configurations.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ConfigurationsListGuard],
    component: RecoverPasswordComponent,
    data: {
      title: 'auth.labels.recover_password'
    }
  },
  {
    path: 'change-password/:token',
    canActivate: [ConfigurationsListGuard],
    component: ChangePasswordComponent,
    data: {
      title: 'auth.labels.change_password'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RecoverPasswordRoutingModule { }
