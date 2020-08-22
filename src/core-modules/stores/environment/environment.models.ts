import { EnvironmentModel as ENVModel, environment } from '../../../app/config/environment.config';
import { CONSTANTS } from '../../../app/config/constants.config';

import { IMqttServiceOptions } from 'ngx-mqtt';
import { MatSidenav } from '@angular/material/sidenav';
import { getAllTimezones } from 'countries-and-timezones';

import { TreeNodeModel } from '@core-modules/catalog/modules/tree';

export interface Timezone {
  name: string;
  country: string;
  utcOffset: number;
  utcOffsetStr: string;
  dstOffset: string;
  dstOffsetStr: string;
  aliasOf: string;
}

export class FieldDeviceTemplateModel extends TreeNodeModel {
  identification: { type: string, version: string };
  product: { type: string, manufacturer: string, family: string, model: string, description: string, version: string };
}

export class EnvironmentModel {

  CONSTANTS: typeof CONSTANTS;

  ENV: ENVModel;

  language: string;

  layout: {
    elements: {
      asideBarLayoutPageLeft: {
        reference: MatSidenav,
        data: { deviceId: string }
      }
    },
    states: {
      devicesListSelections: []
    }
  };

  authentication: {
    user: { auth: string, email: string, name: string, type: string }
    mqttConnection: IMqttServiceOptions
  };

  datasets: {
    deviceTemplates: FieldDeviceTemplateModel[],
    timezones: Timezone[]
  };


  constructor() {

    this.CONSTANTS = CONSTANTS;
    this.ENV = environment;

    this.authentication = null;

    this.layout = {
      elements: {
        asideBarLayoutPageLeft: {
          reference: null,
          data: null
        }
      },
      states: {
        devicesListSelections: []
      }
    };

    this.datasets = {
      deviceTemplates: [],
      timezones: this.initTimezones()
    };

  }

  initTimezones() {
    const timezones: Timezone[] = [];
    Object.keys(getAllTimezones()).forEach(k => {
      timezones.push(getAllTimezones()[k]);
    });

    return timezones.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  }

}
