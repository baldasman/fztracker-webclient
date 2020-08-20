import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

import { EnvironmentStore } from '../environment/environment.store';
import { UrlModel } from '../../core/models/url.model';

@Injectable()
export class DeploysService {

  private apiUrl = this.environmentStore.ENV.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }

  getDeployStatus(deploy: string, queryParams?: { stageParcial: number }) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/deploys/:deploy/status').setPathParams({ deploy });

    if (queryParams) {
      url.setQueryParams(queryParams);
    }

    return this.http.get(url.buildUrl()).pipe(
      map((response: {
        data: {
          totalStages: number,
          stageParcial: number,
          stageTotal: number,
          message: string,
          startDate: number,
          username: string
        }
      }) => response.data)
    );
  }

  getDeploysList(queryParams?: { gateway?: string }) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/deploys/history');

    if (queryParams) {
      url.setQueryParams(queryParams);
    }

    return this.http.get(url.buildUrl()).pipe(
      map((response: {
        data: {
          deploys: {
            id: string,
            deployStatus: string,
            deployFileName: string,
            createdBy: string,
            deployDate: number,
            gateway: {
              id: string,
              name: string
            },
            additionalModules: boolean,
            totalDevices: number
          }[]
        }
      }) => response.data)
    );
  }

  createDeploy(system: string, gateways: { id: string, notes?: string }[]) {

    const url = new UrlModel(this.apiUrl).setPath('edge/v1/deploys');
    return this.http.post(url.buildUrl(), { system, gateways }).pipe(take(1),
      map((response: { data: { deploy: { id: string, gateway: string }[] } }) => {
        return response.data.deploy.map(deploy => ({ id: deploy.id, gatewayId: deploy.gateway }));
      })
    );

  }

}
