import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@app/config';
import { UrlModel } from '@app/base';

import { SystemGatewayModel, SystemModel } from '../../stores';


@Injectable()
export class SystemsService {

  private apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  exportSystem(system: SystemModel) {
    const url = new UrlModel(this.apiUrl).setPath('workspace/v1/systems/export');

    return this.http.post(url.buildUrl(), system, { observe: 'response', responseType: 'text' });
  }

  exportSystemDesktopTool(system: SystemModel) {
    const url = new UrlModel(this.apiUrl).setPath('workspace/v1/systems/export/desktop');

    return this.http.post(url.buildUrl(), system, { observe: 'response', responseType: 'text' });
  }

  getSystemsList(queryParams?: { entity: string }) {
    const url = new UrlModel(this.apiUrl).setPath('organization/v1/systems');
    if (queryParams) {
      url.setQueryParams(queryParams);
    }

    return this.http.get(url.buildUrl()).pipe(
      map((response: { data: {
        systems: {
          id: string,
          name: string,
          entity: {
            id: string,
            name: string
          }
        }[]
      } } ) => response.data)
    );
  }

}
