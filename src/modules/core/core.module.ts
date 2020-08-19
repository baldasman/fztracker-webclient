import { NgModule, SkipSelf, Optional } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiInInterceptor } from '@core/interceptors/api-in.interceptor';
import { ApiOutInterceptor } from '@core/interceptors/api-out.interceptor';

import { ConfigurationsService } from '@core/services/configurations.service';
import { EnvironmentService } from '@core/services/environment.service';
import { FilesService } from '@core/services/files.service';
import { ContextService } from '@core/services/context.service';

import { ConfigurationsListGuard } from './guards/configurations.guard';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    NgbModule
  ],
  exports: [],
  providers: [
    ConfigurationsListGuard,
    ConfigurationsService,
    ContextService,
    EnvironmentService,
    FilesService,
    // Interceptors.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiOutInterceptor,
      multi: true
    }
  ],
  bootstrap: [],
  entryComponents: []
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('Core Module is already loaded. Import it only in AppModule, please!');
    }
  }
}
