import { Constants } from '@app/config/constants';
import { environment } from '@app/config/environment.js';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContextService } from './context.service';

@Injectable()
export class ConfigurationsService {
  private apiUrl = environment.apiUrl;
  private configurationVersion = 'v1';

  constructor(
    private contextService: ContextService,
    private http: HttpClient
  ) {
    let domain;
    if (this.contextService.getReferrer()) {
      domain = this.contextService.getReferrer().split('.')[0];
    }

    switch (domain) {
      case Constants.CLOUD_NODE_DOMAIN:
        this.apiUrl = environment.cnApiUrl;
        break;
      default:
        this.apiUrl = environment.apiUrl;
    }
  }

  getLookupConfigurations(params?) {
    return this.http.post(`${this.apiUrl}configuration/${this.configurationVersion}/app-configurations`, params);
  }

}
