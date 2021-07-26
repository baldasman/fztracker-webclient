import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

import { EnvironmentStore } from '../../stores/environment/environment.store';

import { UrlModel } from '../models/url.model';

@Injectable()
export class AuthenticationService {

  private apiUrl = this.environmentStore.ENV.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }

  verifyToken(token: string) {
    const url = new UrlModel(this.apiUrl).setPath('auth/v1/authenticate').buildUrl();
    return this.http.post(url, { token }).pipe(take(1),
      map((response: { data: { token: string } }) => response.data.token));
  }

  verifySession() {
    const url = new UrlModel(this.apiUrl).setPath('auth/v1/token').buildUrl();
    return this.http.get(url).pipe(take(1),
      map((response: {}) => !!response));
  }

  getSession() {
    const url = new UrlModel(this.apiUrl).setPath('auth/v1/token').buildUrl();
    return this.http.get(url).pipe(take(1),
      map((response: { data: any }) => response.data));
  }

}
