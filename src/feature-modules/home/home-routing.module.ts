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




const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'foto',
        // component: HomeComponent,
        // resolve: { systemResolver: SystemsResolver }
      },
      {
        path: 'home',
        component: HomeComponent,
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'card-list',
        component: CardListComponent,
        // resolve: { systemResolver: SystemsResolver }
      },

      
      {
        path: 'entidades',
        component: EntityListComponent,
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'addentidades',
        component: AddEntityComponent,
        // resolve: { systemResolver: SystemsResolver }
      },
     
      

      {
        path: 'movimentos',
        component: CardMovementComponent,
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'cfhome',
        component: CfHomeComponent,
        // resolve: { systemResolver: SystemsResolver }
      },
      {
        path: 'alfeite',
        component: CfAlfHomeComponent,
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'escola',
        component: EfHomeComponent,
        // resolve: { systemResolver: SystemsResolver }
      },


      {
        path: 'profile/:serial',
        component: CardProfileComponent,
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'profileEdit/:serial',
        component: CardProfileEditComponent,
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'link',
        component: AttachCardComponent ,

        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'controlo',
        component: CardControlViewerComponent ,

        // resolve: { systemResolver: SystemsResolver }
      },
      {
        path: 'foto',
        component: FotoTestComponent,

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
