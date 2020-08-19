import { NgModule } from '@angular/core';

import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { AppLoaderComponent } from './components/app-loader.component';
import { SectionLoaderComponent } from './components/section-loader.component';

import { LoaderService } from './services/loader.service';

@NgModule({
  declarations: [
    AppLoaderComponent,
    SectionLoaderComponent
  ],
  imports: [
    NgxUiLoaderModule
  ],
  exports: [
    AppLoaderComponent,
    SectionLoaderComponent
  ],
  providers: [
    LoaderService
  ]
})

export class LoaderModule { }
