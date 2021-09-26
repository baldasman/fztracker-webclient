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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { EntityListComponent } from './pages/entity-list/entity-list.component';
import { CardControlViewerComponent } from './pages/card-controlViewer/card-controlViewer.component';
import { CfHomeComponent } from './pages/cf-home/cf-home.component';
import { EfHomeComponent } from './pages/ef-home/ef-home.component';
import { AddEntityComponent } from './pages/add-entity/add-entity.component';
import { CfAlfHomeComponent } from './pages/cfalf-home/cfalf-home.component';
import { MovementsService } from '@core-modules/core/services/movements.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FotoTestComponent } from './pages/foto-test/foto-test.component';
import { cardmanualComponent } from './pages/card-manual/card-manual.component';
import { CardArmasViewerComponent } from './pages/card-armasViewer/card-armasViewer.component';
import { controloComponent } from './pages/controlo/controlo.component';





  





@NgModule({
  imports: [
    MainThemeModule,
    SharedModule,
    NgApexchartsModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
      
    
    
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
    CfHomeComponent,
    EfHomeComponent,
    AddEntityComponent,
    CfAlfHomeComponent,
    FotoTestComponent,
    cardmanualComponent,
    CardArmasViewerComponent,
    controloComponent,
    
    

  ],
  providers: [  
    
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule {

  marca:string;  
  modelo:string;  
  cor:string;
  matricula:string;
  status:string;
  

 }
