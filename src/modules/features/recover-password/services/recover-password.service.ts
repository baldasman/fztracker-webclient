import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/config/environment.js';

@Injectable()
export class RecoverPasswordService {
  private apiUrl = environment.apiUrl;
  private authVersion = 'v1';

  constructor(
    private http: HttpClient
  ) { }

  recoverPassword(body: {}) {
    return this.http.post(`${this.apiUrl}auth/${this.authVersion}/recover-password`, body);
  }

  changePassword(body: {}) {
    return this.http.post(`${this.apiUrl}auth/${this.authVersion}/new-password`, body);
  }
}
