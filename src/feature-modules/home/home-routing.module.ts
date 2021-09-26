import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent, CanDeactivateGuard } from '@core-modules/main-theme';
// Pages.
import { HomeComponent } from '@home-feature-module/pages/home/home.component';
import { CardListComponent } from './pages/card-list/card-list.component';
import { AttachCardComponent } from './pages/attach-card/attach-card.component';
import { CardProfileComponent } from './pages/card-profile/card-profile.component';
import { CardProfileEditComponent } from './pages/card-profileEdit/card-profileEdit.component';
import { CardMovementComponent } from './pages/card-movement/card-movement.component';
import { EntityListComponent } from './pages/entity-list/entity-list.component';
import { CardControlViewerComponent } from './pages/card-controlViewer/card-controlViewer.component';
import { CfHomeComponent } from './pages/cf-home/cf-home.component';
import { EfHomeComponent } from './pages/ef-home/ef-home.component';
import { AddEntityComponent } from './pages/add-entity/add-entity.component';
import { CfAlfHomeComponent } from './pages/cfalf-home/cfalf-home.component';
import { FotoTestComponent } from './pages/foto-test/foto-test.component';
import { cardmanualComponent } from './pages/card-manual/card-manual.component';
import { AdminGuard } from '@core-modules/core/guards/admin.guard';
import { PersonalGuard } from '@core-modules/core/guards/personal.guard';
import { AuthenticationGuard } from '@core-modules/core';
import { InstGuard } from '@core-modules/core/guards/inst.guard';
import { CardArmasViewerComponent } from './pages/card-armasViewer/card-armasViewer.component';
import { controloComponent } from './pages/controlo/controlo.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'foto',
        canActivate: [AuthenticationGuard],
        // component: HomeComponent,
        // resolve: { systemResolver: SystemsResolver }
      },
      {
        path: 'home',
       
        component: HomeComponent,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'card-list',
        canActivate: [AdminGuard],
        component: CardListComponent,
        
        // resolve: { systemResolver: SystemsResolver }
      },

      
      {
        path: 'entidades',
        component: EntityListComponent,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'addentidades',
        component: AddEntityComponent,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },
     
      

      {
        path: 'movimentos',
        component: CardMovementComponent,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'cfhome',
        component: CfHomeComponent,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },
      {
        path: 'alfeite',
        component: CfAlfHomeComponent,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'escola',
        component: EfHomeComponent,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

 
      {
        path: 'profile/:serial',
        component: CardProfileComponent,
        canActivate: [PersonalGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'profileEdit/:serial',
        component: CardProfileEditComponent,
        canActivate: [PersonalGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'link',
        component: AttachCardComponent ,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      
      {
        path: 'foto',
        component: FotoTestComponent,
        canActivate: [AuthenticationGuard, InstGuard],
        // resolve: { systemResolver: SystemsResolver }
      },
      {
        path: 'manual',
        component: cardmanualComponent,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },
      {
        path: 'armas',
        component: CardArmasViewerComponent,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'controlo',
        component: controloComponent ,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'controlos',
        component: CardControlViewerComponent ,
        canActivate: [AuthenticationGuard],
        // resolve: { systemResolver: SystemsResolver }
      },

      

      

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
