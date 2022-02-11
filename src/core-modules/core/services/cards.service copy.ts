import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentStore } from '../../stores/environment/environment.store';
import { GunsModel } from '../models/Guns.model';
import { UrlModel } from '../models/url.model';

@Injectable()
export class GunsService {

  private apiUrl = this.environmentStore.ENV.API_URL + "/fztracker";

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }


  getCards(search?: string): Observable<[GunsModel]> {
    const url = new UrlModel(this.apiUrl).setPath('guns/v1');
   
    
    
    
    url.setQueryParams({ search });

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }

}
