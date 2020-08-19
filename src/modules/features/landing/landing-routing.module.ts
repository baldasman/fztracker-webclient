import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


import { MainComponent } from './pages/main/main.component';
import { LandingComponent } from './landing.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

const routes: Routes = [{
  path: '',
  component: LandingComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      component: MainComponent,
      data: {title: 'auth.labels.home'}
    },
    {
      path: 'forbidden',
      pathMatch: 'full',
      component: ForbiddenComponent
    },
  ]
}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})

export class LandingRoutingModule {
}
