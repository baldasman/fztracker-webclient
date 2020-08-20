import { NgModule, Optional, SkipSelf } from '@angular/core';

import { EnvironmentStore } from './environment/environment.store';
import { SystemStore } from './system/system.store';

import { EnvironmentService } from './environment/environment.service';
import { EntitiesService } from './system/services/entities.service';
import { SystemService } from './system/services/system.service';

import { DeploysService } from './services/deploys.service';
import { GatewaysService } from './services/gateways.service';
import { WsTopicsService } from './services/ws-topics.service';

@NgModule({
  providers: [
    EnvironmentStore,
    SystemStore,

    EnvironmentService,
    EntitiesService,
    SystemService,

    DeploysService,
    GatewaysService,
    WsTopicsService
  ]
})
export class StoreModule {
  // Makes sure that this module is imported only by one NgModule (AppModule)!
  constructor(@Optional() @SkipSelf() parentModule: StoreModule) {
    if (parentModule) {
      throw new Error('Store Module is already loaded. Import it only in AppModule, please!');
    }
  }
}
