import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {InsightsComponent} from './insights.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {HomeComponent} from './pages/home/home.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { AdminGuard } from '@core/guards/admin.guard';

const routes: Routes = [{
  path: '',
  component: InsightsComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      component: HomeComponent,
      data: {title: 'auth.labels.home'}
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AdminGuard],
      data: {title: 'auth.labels.dashboard'}
    },
    {
      path: 'stocks',
      component: StocksComponent,
      canActivate: [AdminGuard],
      data: {title: 'auth.labels.stocks'}
    }
  ]
}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})

export class InsightsRoutingModule {
}
