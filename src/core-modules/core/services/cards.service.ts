import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentStore } from '../../stores/environment/environment.store';
import { CardModel } from '../models/card.model';
import { UrlModel } from '../models/url.model';

@Injectable()
export class CardsService {

  private apiUrl = this.environmentStore.ENV.API_URL + "/fztracker";

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }


  getCards(search?: string): Observable<[CardModel]> {
    const url = new UrlModel(this.apiUrl).setPath('cards/v1');
   
    
    
    
    url.setQueryParams({ search });

    return this.http.get(url.buildUrl())
      .pipe(
        map((response: { data: any }) => response.data)
      );
  }

}
