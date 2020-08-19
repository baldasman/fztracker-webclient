import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppGenericCardComponent } from './generic-card/generic-card.component';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppGenericCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularFormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    AppGenericCardComponent
  ],
  providers: [
  ]
})

export class VisualComponentsModule { }
