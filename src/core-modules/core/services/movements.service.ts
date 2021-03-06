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


  getMovements(search?: string, from?: string, to?: string, local?: string): Observable<[MovementModel]> {
    const url = new UrlModel(this.apiUrl).setPath('/movements/v1');
    let filter = {};
      if (search) {
         filter = {...filter, search};
      }
      if (from) {
        filter = {...filter, from};
      }
     if (to) {
      filter = {...filter, to};
      }
      if (local) {
        filter = {...filter, local};
       }
    console.log(filter);
    url.setQueryParams(filter);

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }

}
