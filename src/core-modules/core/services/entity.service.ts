import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentStore } from '../../stores/environment/environment.store';
import { EntityModel } from '../models/entity.model';
import { UrlModel } from '../models/url.model';

@Injectable()
export class EntityService {

  private apiUrl = this.environmentStore.ENV.API_URL + "/fztracker";

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }


  getEntity(search: {serial?: string, cardNumber?: string}): Observable<[EntityModel]> {
    const url = new UrlModel(this.apiUrl).setPath('entities/v1');

    let filter = {};
    if (search.serial && search.serial.trim().length > 0) {
      filter = { ...filter, serial: search.serial };
    }
    
    if (search.cardNumber && search.cardNumber.trim().length > 0) {
      filter = { ...filter, cardNumber: search.cardNumber };
    }

    url.setQueryParams(filter);

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }

}
