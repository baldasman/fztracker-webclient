import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTreeModule } from '@angular/material/tree';

import { TreeComponent } from './components/tree.component';

@NgModule({
  imports: [
    CommonModule,
    MatTreeModule
  ],
  declarations: [
    TreeComponent
  ],
  exports: [
    TreeComponent
  ]
})
export class TreeModule { }
