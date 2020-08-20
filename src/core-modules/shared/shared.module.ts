import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { DynamicIoModule } from 'ng-dynamic-component';
import { LazyMapsAPILoaderConfigLiteral } from '@agm/core';

import { environment } from '@app/config';

import { FormsModule } from '../catalog/modules/forms';
import { LoaderModule } from '../catalog/modules/loader';
import { TreeModule } from '../catalog/modules/tree';
import { UploadsModule } from '../catalog/modules/uploads';

@Injectable()
export class GoogleMapsConfig implements LazyMapsAPILoaderConfigLiteral {
  public apiKey: string;
  public libraries: string[];
  constructor() {
    this.apiKey = environment.GOOGLE_API_KEY;
    this.libraries = ['places'];
  }
}

@NgModule({
  imports: [
    FormsModule.forRoot({ googleMapsConfig: GoogleMapsConfig })
  ],
  exports: [
    CommonModule,
    RouterModule,

    TranslateModule,
    DynamicIoModule,

    FormsModule,
    LoaderModule,
    TreeModule,
    UploadsModule
  ]
})
export class SharedModule { }
