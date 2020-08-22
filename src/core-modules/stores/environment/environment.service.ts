import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../app/config';

import { UrlModel } from '../../core/models/url.model';

import { FieldDeviceTemplateModel } from './environment.models';

@Injectable()
export class EnvironmentService {

  private apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }
  
  getUserInfo() {
    const url = new UrlModel(this.apiUrl).setPath('auth/v1/token');
    return this.http.get(url.buildUrl()).pipe(
      map((response: {
        data: {
          session: {
            authId: string,
            sessionId: string,
            sessionType: string,
            numberOfLogins: number,
            lastLoginDate: number,
            ttl: number,
            createdAt: number,
          },
          user: {
            name: string,
            isAdmin: boolean
          }
        }
      }) => ({
        user: { 
          auth: response.data.session.authId, 
          email: response.data.session.authId, 
          name: response.data.user.name, 
          type: response.data.session.sessionType 
        }
      })
      )
    );
  }

}
