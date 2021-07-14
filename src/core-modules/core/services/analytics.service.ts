import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentStore } from '../../stores/environment/environment.store';
import { MovementModel } from '../models/movement.model';
import { UrlModel } from '../models/url.model';

@Injectable()
export class AnalyticsService {

  private apiUrl = this.environmentStore.ENV.API_URL + "/fztracker/analytics/v1";

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }


  getMovementsByDate(inOut?: boolean, from?: string): Observable<[MovementModel]> {
    const url = new UrlModel(this.apiUrl).setPath('/movements/byDate');
    let filter = {};
    if (inOut) {
      filter = { ...filter, inOut };
    }
    if (from) {
      filter = { ...filter, from };
    }

    console.log('getMovementsByDate', filter);
    url.setQueryParams(filter);

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }

  getMovementsCountByDate(inOut?: boolean, from?: string ): Observable<{count: number }> {
    const url = new UrlModel(this.apiUrl).setPath('/movements/CountbyDate');
    let filter = {};
    if (inOut) {
      filter = { ...filter, inOut };
    }
    if (from) {
      filter = { ...filter, from };

     
    }

    console.log('getMovementsByDate', filter);
    url.setQueryParams(filter);

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }

  entitesCountByState(inOut: boolean, local?: string): Observable<[MovementModel]> {
    const url = new UrlModel(this.apiUrl).setPath('/entitesCountByState');
    let filter = {};
    filter = { ...filter, inOut };
    
    if (local) {
      filter = { ...filter, local };
    }

    console.log('entitesCountByState', filter);
    url.setQueryParams(filter);

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }
}
