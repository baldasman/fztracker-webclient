import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@app/config/environment.js';
import {UrlModel} from '@core/models/url.model';
import {ContextService} from '@core/services/context.service';

@Injectable()
export class ProductService {
  private apiUrl = environment.apiUrl + 'insights/v1/cards';

  constructor(
      private contextService: ContextService, private http: HttpClient) {
    let domain;
    if (this.contextService.getReferrer()) {
      domain = this.contextService.getReferrer().split('.')[0];
    }
  }

  getProducts(params?: object) {
    const url = new UrlModel(this.apiUrl);

    if (params) {
      url.setQueryParams(params);
    }


    return this.http.get(url.buildUrl());
  }

  getAbcByDates(params?: object) {
    const url = new UrlModel(this.apiUrl);
    url.setPath('abc/:startDate/:endDate');

    if (params) {
      url.setPathParams(params);
    }

    return this.http.get(url.buildUrl());
  }
}
