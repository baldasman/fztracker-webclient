import { NgxLoggerLevel } from 'ngx-logger';


// tslint:disable: no-string-literal needed to avoid build issues
if (!window['__env']) {
  window['__env'] = {};
}

export class EnvironmentModel {
  DOMAIN: string;
  BASE_HREF: string;
  API_URL: string;
  GOOGLE_API_KEY: string;
  LOG_LEVEL: NgxLoggerLevel;

  WS_PROTOCOL: 'ws' | 'wss';
  WS_HOSTNAME: string;
  WS_PORT: number;
  WS_PATH: string;
  WS_USERNAME: string;
  WS_PASSWORD: string;
  LOCAIS: string[];
  UNINDADES: string[];
}

export const environment: EnvironmentModel = {
  DOMAIN:  window['__env'].DOMAIN,
  BASE_HREF: window['__env'].BASE_HREF || '',
  API_URL: window['__env'].API_URL,
  GOOGLE_API_KEY: window['__env'].GOOGLE_API_KEY,
  LOG_LEVEL: NgxLoggerLevel[String((window['__env'].LOG_LEVEL) || 'ERROR')],

  WS_PROTOCOL: window['__env'].WS_PROTOCOL || 'wss',
  WS_HOSTNAME: window['__env'].WS_HOSTNAME,
  WS_PORT: window['__env'].WS_PORT || 443,
  WS_PATH: window['__env'].WS_PATH || '',
  WS_USERNAME: window['__env'].WS_USERNAME || '',
  WS_PASSWORD: window['__env'].WS_PASSWORD || '',
  LOCAIS: window['__env'].LOCAIS || [],
  UNINDADES: window['__env'].UNIDADES || [],
};
