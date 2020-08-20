import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationComponent } from './authentication.component';

import { SignInComponent } from '@auth-feature-module/pages/sign-in/sign-in.component';
import { SignOutComponent } from '@auth-feature-module/pages/sign-out/sign-out.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        redirectTo: 'signin'
      },
      {
        path: 'signin',
        component: SignInComponent,
        pathMatch: 'full'
      },
      {
        path: 'signout',
        component: SignOutComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
