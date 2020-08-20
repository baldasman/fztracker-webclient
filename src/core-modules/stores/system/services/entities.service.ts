import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@app/config';
import { UrlModel } from '@core-modules/core/models/url.model';


@Injectable()
export class EntitiesService {

  private apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  getEntitiesList() {
    const url = new UrlModel(this.apiUrl).setPath('organization/v1/entities');

    return this.http.get(url.buildUrl()).pipe(
      map((response: {
        data: {
          entities: [
            {
              id: string,
              name: string,
              timezone: string,
              defaultTimezone: string
            }
          ]
        }
      }) => response.data)
    );
  }
}
