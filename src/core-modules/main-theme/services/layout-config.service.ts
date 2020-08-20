import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { merge, get } from 'lodash';

import { LayoutConfigModel } from '../_config/layout-config.model';

@Injectable()
export class LayoutConfigService {

  onConfigUpdated$: Subject<LayoutConfigModel>;
  layoutConfig: LayoutConfigModel;

  constructor() {
    this.onConfigUpdated$ = new Subject(); // register on config changed event and set default config
  }


  loadConfiguration(config: LayoutConfigModel) {
    this.layoutConfig = config;
  }


  getConfig(path?: string): LayoutConfigModel | any {

    if (path) { return get(this.layoutConfig, path); }

    return this.layoutConfig;

  }

  setConfig(value: any): void {
    this.layoutConfig = merge(this.layoutConfig, value);

    this.onConfigUpdated$.next(this.layoutConfig); // fire off an event that all subscribers will listen
  }

  /**
   * Get brand logo
   */
  getLogo(): string {
    const menuAsideLeftSkin = get(this.layoutConfig, 'brand.self.theme');
    // set brand logo
    const logoObject = get(this.layoutConfig, 'self.logo');

    let logo;
    if (typeof logoObject === 'string') {
      logo = logoObject;
    }
    if (typeof logoObject === 'object') {
      logo = get(logoObject, menuAsideLeftSkin + '');
    }
    if (typeof logo === 'undefined') {
      try {
        const logos = get(this.layoutConfig, 'self.logo');
        logo = logos[Object.keys(logos)[0]];
      } catch (e) {
      }
    }
    return logo;
  }

  /**
   * Returns sticky logo
   */
  getStickyLogo(): string {
    let logo = get(this.layoutConfig, 'self.logo.sticky');
    if (typeof logo === 'undefined') {
      logo = this.getLogo();
    }
    return logo + '';
  }

}
