import { AppInjector } from '@core-modules/core';

import { EnvironmentStore, SystemStore } from '@core-modules/stores';

export class Stores {

  public store: {
    environment: EnvironmentStore,
    system: SystemStore
  };

  constructor() {

    const injector = AppInjector.getInjector();

    this.store = {
      environment: injector.get(EnvironmentStore),
      system: injector.get(SystemStore)
    };

  }

}
