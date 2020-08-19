import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/config/environment.js';

@Injectable()
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  private url = environment.apiUrl;

  getSession() {
    return this.http.get(this.url + 'auth/v1/token');
  }

  getUser(params: {}) {
    return this.http.get(this.url + 'insights/v1/user/info?authId=' + params['authId']);
  }
}

