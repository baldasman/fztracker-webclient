import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentStore } from '../../stores';


@Injectable()
export class StoresResolver implements Resolve<any> {

  constructor(
    private environmentStore: EnvironmentStore
  ) { }

  resolve(): Observable<boolean> {

    return forkJoin([
      this.environmentStore.initializeStore$()
    ]).pipe(
      map(([envStoreInitialized]) => (envStoreInitialized))
    );

  }

}
