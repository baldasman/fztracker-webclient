import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DropzoneModule } from 'ngx-dropzone-wrapper';

// Components.
import { UploadsComponent } from './uploads.component';

@NgModule({
  imports: [
    TranslateModule,
    DropzoneModule
  ],
  declarations: [
    UploadsComponent
  ],
  exports: [
    UploadsComponent
  ]
})
export class UploadsModule { }
