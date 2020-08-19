import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/config/environment.js';
import { Constants } from '@app/config/constants';

@Injectable()
export class ConfirmAccountService {
  private apiUrl = environment.apiUrl;
  private authVersion = 'v1';

  constructor(
    private http: HttpClient
  ) { }

  validateConfirmationCode(code: string, token: string) {
    return this.http.post(`${this.apiUrl}auth/${this.authVersion}/validate-confirmation-code`, { confirmationCode: code, token });
  }

  confirmAccount(token: string) {
    return this.http.post(`${this.apiUrl}auth/${this.authVersion}/confirm-account`, { token });
  }

  resendConfirmationEmail(email: string) {
    return this.http.post(`${this.apiUrl}auth/${this.authVersion}/resend-confirmation-email`, { email });
  }

  changePassword(body: {}) {
    return this.http.post(`${this.apiUrl}auth/${this.authVersion}/new-password`, body);
  }
}
