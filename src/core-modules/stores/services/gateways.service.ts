import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { EnvironmentStore } from '../environment/environment.store';

import { UrlModel } from '../../core/models/url.model';
import { QueryParamsModel } from '../../core/models/query-params.model';

import { SystemGatewayStatusEnum, SystemGatewayModel, SystemGatewayConnectionTypeEnum } from '../system/system.models';

export class CreateGatewayModel { system: string; serialNumber: string; labelKey: string; name: string; description: string; }
export class ReplaceGatewayModel { newSerialNumber: string; currentLabelKey: string; newLabelKey: string; name: string; description: string; }
export interface VersionListModel {
  savedAt: number;
  savedBy: string;
  version: string;
  tag: string;
  deploy: {
    id: string;
    deployedBy: string;
    deployedAt: number;
    notes?: string;
    status: 'STARTED' | 'DEPLOYING' | 'COMPLETED::OK' | 'COMPLETED::ERROR';
    message: string;
  };
}

@Injectable()
export class GatewaysService {

  private apiUrl = this.environmentStore.ENV.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }


  createLicense(body: {
    user: { auth: string, email: string, type: number },
    tenant: string, entity: string, system: string,
    gatewayTemplate: string
  }) {
    const url = new UrlModel(this.apiUrl).setPath('licensing/v1/gateways');
    return this.http.post(url.buildUrl(), body).pipe(take(1),
      map((response: { data: { registrationCode: string, command: string } }) => response.data)
    );

  }

  getGatewayTemplatesList() {
    const url = new UrlModel(this.apiUrl).setPath('licensing/v1/gateways/catalog');
    return this.http.get(url.buildUrl()).pipe(take(1),
      map((response: { data: { gateways: { id: string, name: string, imageUrl: string }[] } }) => response.data.gateways)
    );
  }


  createGateway(gateway: CreateGatewayModel) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/gateways');
    return this.http.post(url.buildUrl(), gateway).pipe(
      map((response: { data: { id: string } }) => response.data)
    );
  }

  replaceGateway(gateway: string, body: ReplaceGatewayModel) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/gateways/:gateway/replace').setPathParams({ gateway });
    return this.http.post(url.buildUrl(), body).pipe(
      map((response: { data: { id: string } }) => response.data)
    );
  }

  editGateway(gateway: string, body: { name: string, description: string }) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/gateways/:gateway').setPathParams({ gateway });
    return this.http.put(url.buildUrl(), body);
  }

  deleteGateway(gateway: string, queryParams: { labelKey: string }) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/gateways/:gateway').setPathParams({ gateway }).setQueryParams(queryParams);
    return this.http.delete(url.buildUrl());
  }

  getGatewayConnections(gateway: string, queryParams?: QueryParamsModel) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/gateways/:gateway/connections').setPathParams({ gateway });

    if (queryParams) {
      url.setQueryParams(queryParams);
    }

    return this.http.get(encodeURI(url.buildUrl())).pipe(take(1),
      map((response: {
        data: {
          connections: { state: string, createdAt: string }[],
          totalRows: number
        }
      }) => response.data));
  }

  getGatewayStatus(gateway: string) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/gateways/:gateway/status').setPathParams({ gateway });
    return this.http.get(url.buildUrl()).pipe(take(1),
      map((response: {
        data: {
          connectionType: SystemGatewayConnectionTypeEnum,
          ipAddress: string,
          status: { id: SystemGatewayStatusEnum, updatedAt: number }
        }
      }) => response.data)
    );
  }

  getGatewayVersion(gateway: string, version: string) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/gateways/:gateway/version').setPathParams({ gateway }).setQueryParams({ version });
    return this.http.get(url.buildUrl()).pipe(take(1),
      map((response: { data: SystemGatewayModel }) => new SystemGatewayModel(response.data))
    );
  }

  getVersionHistory(gateway: string, queryParams?: QueryParamsModel) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/gateways/:gateway/versions').setPathParams({ gateway });

    if (queryParams) {
      url.setQueryParams(queryParams);
    }

    return this.http.get(encodeURI(url.buildUrl())).pipe(take(1),
      map((response: {
        data: {
          versions: VersionListModel[],
          totalRows: number
        }
      }) => ({
        versions: response.data.versions.map(v => ({
          ...v,
          savedAt: (v.savedAt || 0) * 1000,
          deploy: !isEmpty(v.deploy) ? {
            ...v.deploy,
            deployedAt: typeof v.deploy.deployedAt === 'number' ? (v.deploy.deployedAt || 0) * 1000 : 0,
            message: v.deploy.message ? `features.deploy.states.${v.deploy.message}` : null
          } : null
        })),
        totalRows: response.data.totalRows
      }))
    );
  }

  sendCommand(gateway: string, command: 'GET' | 'SET' | 'DEBUG' | 'REALTIME', body: { instructionId?: string, message: { property?: string, value?: string } }) {
    const url = new UrlModel(this.apiUrl).setPath('edge/v1/gateways/:gateway/command').setPathParams({ gateway });
    return this.http.post(url.buildUrl(), { command, instructionId: body.instructionId, message: body.message }).pipe(take(1),
      map((response: { data: { instructionId: string, status: 'ON' | 'OFF' | 'OK' } }) => response.data)
    );
  }

}
