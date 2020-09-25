import { NgModule } from '@angular/core';
import { MainThemeModule } from '@core-modules/main-theme';
import { SharedModule } from '@core-modules/shared';
import { NgApexchartsModule } from 'ng-apexcharts';
// Pages.
import { HomeComponent } from '@home-feature-module/pages/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { AttachCardComponent } from './pages/attach-card/attach-card.component';
import { CardListComponent } from './pages/card-list/card-list.component';
import { CardAddComponent } from './pages/card-add/card-add.component';







@NgModule({
  imports: [
    MainThemeModule,
    SharedModule,
    NgApexchartsModule,
    HomeRoutingModule,
    
    
    
  ],
  declarations: [
    HomeComponent,
    AttachCardComponent,
    CardListComponent,
    CardAddComponent

  ],
  providers: [
    
  ]
})
export class HomeModule { }
