import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Mixin, Core, Stores } from '@app/base';

import { UrlModel } from '@core-modules/core';

@Injectable()
export class AuthenticationService extends Mixin(Core, Stores) {

  private apiUrl = this.store.environment.ENV.API_URL;

  constructor() { super(); }

  signIn(username: string, password: string): Observable<{ token: string , externalId: string, isUser: boolean, isAdmin: boolean, accessRank: boolean}> {
    const url = new UrlModel(this.apiUrl).setPath('auth/v1/signin');
    return this.http.post(url.buildUrl(), { authId: username, password, sessionType: 'portal' })
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }

  signOut(): Observable<{}> {
    const url = new UrlModel(this.apiUrl).setPath('auth/v1/logout');
    return this.http.delete(url.buildUrl());
  }

}
