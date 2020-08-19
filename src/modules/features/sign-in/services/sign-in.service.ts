import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/config/environment.js';
import { Constants } from '@app/config/constants';

import { ContextService } from '@core/services/context.service';

@Injectable()
export class SignInService {
  private apiUrl = environment.apiUrl;
  private authVersion = 'v1';

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

  signIn(body: object) {
    return this.http.post(`${this.apiUrl}auth/${this.authVersion}/signin`, body);
  }

  resendConfirmationEmail(body: {}) {
    return this.http.post(`${this.apiUrl}auth/${this.authVersion}/resend-confirmation-email`, body);
  }

  verifyToken() {
    return this.http.get(`${this.apiUrl}auth/${this.authVersion}/token`);
  }
}
