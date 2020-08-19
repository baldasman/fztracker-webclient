import { Injectable } from '@angular/core';
import { environment } from '@app/config/environment.js';
import { Constants } from '@app/config/constants';

@Injectable()
export class FilesService {

  constructor() { }

  private apiUrl = Constants.API_REST_VERSION ? `${environment.apiUrl}${Constants.API_REST_VERSION}/` : environment.apiUrl;

  getPublicImageURL(fileKey) {
    return `${this.apiUrl}files/${fileKey}`;
  }

}
