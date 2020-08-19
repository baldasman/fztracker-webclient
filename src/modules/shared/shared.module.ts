import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from './catalog/forms';
import { LoaderModule } from './catalog/loader';
import { TranslateModule } from '@ngx-translate/core';
import { VisualComponentsModule } from './catalog/visual-components/visual-components.module';

import { SignInLayoutComponent } from './components/sign-in-layout/sign-in-layout.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
@NgModule({
  declarations: [
    HomeLayoutComponent,
    SignInLayoutComponent
  ],
  imports: [
    AngularFormsModule,
    CommonModule,
    FormsModule,
    LoaderModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    VisualComponentsModule
  ],
  exports: [
    HomeLayoutComponent,
    SignInLayoutComponent,
    AngularFormsModule,
    CommonModule,
    FormsModule,
    LoaderModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    VisualComponentsModule
  ],
  providers: [],
  entryComponents: []
})

export class SharedModule { }
