import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { EnvironmentStore, SystemStore } from '../../stores';

@Injectable()
export class StoresResolver implements Resolve<any> {

  constructor(
    private environmentStore: EnvironmentStore,
    private systemStore: SystemStore
  ) { }

  resolve(): Observable<boolean> {

    return forkJoin([
      this.environmentStore.initializeStore$(),
      this.systemStore.initializeStore$()
    ]).pipe(
      map(([envStoreInitialized, wsStoreInitialized]) => (envStoreInitialized && wsStoreInitialized))
    );

  }

}
