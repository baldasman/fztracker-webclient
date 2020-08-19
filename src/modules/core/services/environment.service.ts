import { Injectable } from '@angular/core';

@Injectable()
export class EnvironmentService {

  private configurations: object; // type, value

  constructor() {
    this.configurations = {};
  }

  getConfiguration(configurationKey) {
    if (this.configurations.hasOwnProperty(configurationKey)) {
      return this.configurations[configurationKey].value;
    }
    return null;
  }

  getConfigurations() {
    return this.configurations;
  }

  setConfigurations(configurations) {
    Object.keys(configurations).forEach(key => {
      this.configurations[key] = configurations[key];
      // value comes as string from storage
      switch (configurations[key].type) {
        case 'object':
        case 'array':
          this.configurations[key].value = JSON.parse(configurations[key].value);
          break;
        case 'boolean':
          this.configurations[key].value = (configurations[key].value === 'true');
          break;
        case 'integer':
          this.configurations[key].value = +configurations[key].value;
          break;
        default:
          this.configurations[key].value = configurations[key].value;
          break;
      }
    });
  }
}
