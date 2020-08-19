import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmAccountComponent } from '@sign-up/pages/confirm-account/confirm-account.controller';
import { SignUpComponent } from '@sign-up/sign-up.component';

import { RegisterGuard } from '@core/guards/register-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [RegisterGuard],
    component: SignUpComponent,
    data: {
      title: 'auth.labels.sign_up'
    }
  },
  {
    path: 'confirm/:token',
    component: ConfirmAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SignUpRoutingModule { }
