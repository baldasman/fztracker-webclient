import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

import { EnvironmentStore } from '../../environment/environment.store';

import { UrlModel } from '../../../core/models/url.model';
import { SystemModel, SystemZoneModel } from '../system.models';


@Injectable()
export class SystemService {

  private apiUrl = this.environmentStore.ENV.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }

  getEntitiesInfo() {
    const url = new UrlModel(this.apiUrl).setPath('organization/v1/entities/:entity').setPathParams({ entity: this.environmentStore.getAuthenticationInfo().entity.id });
    return this.http.get(url.buildUrl()).pipe(
      map((response: { data: { systems: { system: {}, gateways: {}[] } } }) => response.data)
    );
  }

  getSystemZones(system: string) {
    const url = new UrlModel(this.apiUrl).setPath('organization/v1/zones').setQueryParams({ system });
    return this.http.get(url.buildUrl()).pipe(take(1),
      map((response: { data: { tree: SystemZoneModel[] } }) => response.data.tree)
    );
  }

  createSystem(system: SystemModel) {
    const url = new UrlModel(this.apiUrl).setPath('organization/v1/systems');
    return this.http.post(url.buildUrl(), system).pipe(
      map((response: { data: { id: string } }) => response.data)
    );
  }

  openSystem(system: string) {
    const url = new UrlModel(this.apiUrl).setPath('workspace/v1/systems/:system/open').setPathParams({ system });
    return this.http.get(url.buildUrl()).pipe(take(1),
      map((response: { data: SystemModel }) => response.data));
  }

  editSystem(system: string, body: SystemModel) {
    const url = new UrlModel(this.apiUrl).setPath('organization/v1/systems/:system').setPathParams({ system });
    return this.http.put(url.buildUrl(), body);
  }

  saveSystem(system: SystemModel) {
    const url = new UrlModel(this.apiUrl).setPath('workspace/v1/systems/save').setQueryParams({ system: system.id });
    return this.http.post(url.buildUrl(), system).pipe(take(1),
      map((response: { data: { id: string } }) =>  ({ id: response.data.id }) )
    );
  }

}
