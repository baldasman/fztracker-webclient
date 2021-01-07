import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentStore } from '../../stores/environment/environment.store';
import { MovementModel } from '../models/movement.model';
import { UrlModel } from '../models/url.model';

@Injectable()
export class MovementsService {

  private apiUrl = this.environmentStore.ENV.API_URL + "/fztracker";

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }


  getMovements(search?: string): Observable<[MovementModel]> {
    const url = new UrlModel(this.apiUrl).setPath('/movements/v1');
    url.setQueryParams({ search });

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }

}
