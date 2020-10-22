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




const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
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
        path: 'movimentos',
        component: CardMovementComponent,
        // resolve: { systemResolver: SystemsResolver }
      },


      {
        path: 'profile',
        component: CardProfileComponent,
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'profileEdit',
        component: CardProfileEditComponent,
        // resolve: { systemResolver: SystemsResolver }
      },

      {
        path: 'link',
        component: AttachCardComponent ,

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
