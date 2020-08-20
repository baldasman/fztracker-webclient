import { NgModule } from '@angular/core';
import { MainThemeModule } from '@core-modules/main-theme';
import { SharedModule } from '@core-modules/shared';
import { NgApexchartsModule } from 'ng-apexcharts';
// Pages.
import { HomeComponent } from '@home-feature-module/pages/home/home.component';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    MainThemeModule,
    SharedModule,
    NgApexchartsModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
  ],
  providers: [
    
  ]
})
export class HomeModule { }
