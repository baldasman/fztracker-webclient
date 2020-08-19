import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from '@sign-in/sign-in.component';

import { ConfigurationsListGuard } from '@core/guards/configurations.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ConfigurationsListGuard],
    component: SignInComponent,
    data: {
      title: 'auth.labels.sign_in'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SignInRoutingModule { }
