import { AppInjector } from '@core-modules/core';
import { EnvironmentStore } from '@core-modules/stores';


export class Stores {

  public store: {
    environment: EnvironmentStore
  };

  constructor() {

    const injector = AppInjector.getInjector();

    this.store = {
      environment: injector.get(EnvironmentStore)
    };

  }

}
