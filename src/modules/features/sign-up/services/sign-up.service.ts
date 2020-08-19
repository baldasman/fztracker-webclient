import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/config/environment.js';
import { Constants } from '@app/config/constants';

import { ContextService } from '@core/services/context.service';

@Injectable()
export class SignUpService {
  private apiUrl = environment.apiUrl;
  private authVersion = 'v1';
  private utilsVersion = 'v1';

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

  signUp(body: {}) {
    return this.http.post(`${this.apiUrl}auth/${this.authVersion}/signup`, body);
  }

  getCountriesList() {
    return this.http.get(`${this.apiUrl}utils/${this.utilsVersion}/countries`);
  }

  getCompanyTypesList() {
    return this.http.get(`${this.apiUrl}utils/${this.utilsVersion}/company-types`);
  }
}
