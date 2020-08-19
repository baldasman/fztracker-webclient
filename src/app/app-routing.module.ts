import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '@core/guards/auth.guard';
import {ConfigurationsListGuard} from '@core/guards/configurations.guard';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'landing'}, 
  {
    path: 'landing',
    pathMatch: 'prefix',
    loadChildren: '@landing/landing.module#LandingModule'
  },
  {
    path: 'insights',
    pathMatch: 'prefix',
    canActivate: [AuthGuard],
    loadChildren: '@insights/insights.module#InsightsModule'
  },
  {path: 'signin', loadChildren: '@sign-in/sign-in.module#SignInModule'}, 
  {
    path: 'signup',
    canActivate: [ConfigurationsListGuard],
    loadChildren: '@sign-up/sign-up.module#SignUpModule'
  },
  {
    path: 'recover',
    loadChildren: '@recover/recover-password.module#RecoverPasswordModule'
  },
  {path: '**', redirectTo: 'landing'}
];

@NgModule({imports: [RouterModule.forRoot(routes)], exports: [RouterModule]})
export class AppRoutingModule {
}
