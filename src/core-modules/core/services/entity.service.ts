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


  getEntity(search?: string): Observable<[EntityModel]> {
    const url = new UrlModel(this.apiUrl).setPath('entities/v1');
    url.setQueryParams({ search });

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }

}
