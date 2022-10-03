import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentStore } from '../../stores/environment/environment.store';
import { MovementModel } from '../models/movement.model';
import { SiteHoursModel } from '../models/site-hours.model';
import { UrlModel } from '../models/url.model';

@Injectable()
export class MovementsService {
  private apiUrl = this.environmentStore.ENV.API_URL + '/fztracker';

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) {}

  getMovements(
    search?: string,
    from?: string,
    to?: string,
    local?: string
  ): Observable<[MovementModel]> {
    const url = new UrlModel(this.apiUrl).setPath('/movements/v1');
    let filter = {};
    if (search) {
      filter = { ...filter, search };
    }
    if (from) {
      filter = { ...filter, from };
    }
    if (to) {
      filter = { ...filter, to };
    }
    if (local) {
      filter = { ...filter, local };
    }
    console.log(filter);
    url.setQueryParams(filter);

    return this.http
      .get(url.buildUrl())
      .pipe(map((response: { data: any }) => response.data));
  }

  addmovement(
    location: string,
    sensor: string,
    cardId: string,
    manual: boolean,
    inOut: boolean
  ) {
    const url = new UrlModel(this.apiUrl).setPath('/entities/v1/movement');
    const body = {
      location,
      sensor,
      cardId,
      manual,
      inOut,
    };

    return this.http
      .post(url.buildUrl(), body)
      .pipe(map((response: { data: any }) => response.data));
  }

  getSiteHours(entitySerial: string, from: string, to: string): Observable<SiteHoursModel> {
    const url = new UrlModel(this.apiUrl).setPath('/movements/v1/site-hours');
    let filter = {entitySerial, from, to};
    
    console.log('getSiteHours', filter);
    url.setQueryParams(filter);

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }
}
