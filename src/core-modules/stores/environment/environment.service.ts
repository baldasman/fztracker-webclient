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
    const url = new UrlModel(this.apiUrl).setPath('auth/v1/user/details');
    return this.http.get(url.buildUrl()).pipe(
      map((response: {
        data: {
          auth: string,
          name: string,
          email?: string,
          type?: number,
          entity: { id: string, name: string }
        }
      }) => ({
        user: { auth: response.data.auth, email: response.data.email, name: response.data.name, type: response.data.type },
        entity: response.data.entity
      })
      )
    );
  }

}
