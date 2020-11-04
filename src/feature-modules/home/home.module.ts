import { NgModule } from '@angular/core';
import { MainThemeModule } from '@core-modules/main-theme';
import { SharedModule } from '@core-modules/shared';
import { NgApexchartsModule } from 'ng-apexcharts';
// Pages.
import { HomeComponent } from '@home-feature-module/pages/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { AttachCardComponent } from './pages/attach-card/attach-card.component';
import { CardListComponent } from './pages/card-list/card-list.component';
import { CardProfileComponent } from './pages/card-profile/card-profile.component';
import { CardProfileEditComponent } from './pages/card-profileEdit/card-profileEdit.component';
import { CardMovementComponent } from './pages/card-movement/card-movement.component'; 

import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { EntityListComponent } from './pages/entity-list/entity-list.component';
import { CardControlViewerComponent } from './pages/card-controlViewer/card-controlViewer.component';






  





@NgModule({
  imports: [
    MainThemeModule,
    SharedModule,
    NgApexchartsModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
      
    
    
  ],
  declarations: [
    HomeComponent,
    AttachCardComponent,
    CardListComponent,
    CardProfileComponent,
    CardProfileEditComponent,
    CardMovementComponent,
    EntityListComponent,
    CardControlViewerComponent,
    

  ],
  providers: [ 
    
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule {

  card:string;  
  type:string;  
  uid:string;
  statuscard:string;
  addcards:string;

 }
