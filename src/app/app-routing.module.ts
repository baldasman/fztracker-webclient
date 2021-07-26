import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '@core-modules/core';

import { StoresResolver } from '@core-modules/core';

import { PageNotFoundComponent } from '@core-modules/main-theme';

const routes: Routes = [
  {
    path: 'not-found',
    component: PageNotFoundComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('@auth-feature-module/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: '',
    //canActivate: [AuthenticationGuard],
    resolve: {
      storesResolver: StoresResolver
    },
    loadChildren: () => import('@home-feature-module/home.module').then(m => m.HomeModule)
  },

  {
    path: '**',
    redirectTo: 'not-found',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
