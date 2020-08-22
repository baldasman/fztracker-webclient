import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MqttService } from 'ngx-mqtt';

import { registerLocaleData } from '@angular/common';
import localeEN from '@angular/common/locales/en';
import localePT from '@angular/common/locales/pt';
import { TranslateService } from '@ngx-translate/core';

import { Store } from '../store.class';

import { EnvironmentService } from './environment.service';

import { EnvironmentModel, FieldDeviceTemplateModel } from './environment.models';

import { TreeNodeModel } from '@core-modules/catalog/modules/tree';
import { StoreHelper } from '../helpers/store.helper';


@Injectable()
export class EnvironmentStore extends Store<EnvironmentModel> implements OnDestroy {

  private subscriptions: Subscription[] = [];

  get ENV() { return this.state.ENV; }
  get CONSTANTS() { return this.state.CONSTANTS; }
  get language() { return this.state.language; }

  constructor(
    private environmentService: EnvironmentService,
    private logger: NGXLogger,
    private mqttService: MqttService,
    private titleService: Title,
    private translateService: TranslateService
  ) {
    super('store::environment', new EnvironmentModel());
  }

  initializeStore$(): Observable<boolean> {

    const subscription$: Subject<boolean> = new Subject<boolean>();

    this.initializeLanguage();

    this.titleService.setTitle(this.translateService.instant('app.title')); // Can only be setted after translations initialization.

    this.populateAuthenticationInfo();

    return new Observable((observer: Observer<boolean>) => {
      this.state$.pipe(takeUntil(subscription$)).subscribe(state => {

        if ( // To this store be proper initialized it has to:
          state.authentication // Has authentication info!
        ) {

          // this.initializeWebsockets(); // Having authentication information, we can start WebSockets connection.

          subscription$.next(true);
          subscription$.unsubscribe(); // Unsubscribe own subscription.
          observer.next(true);
          observer.complete(); // Complete observable.
        }
      });
    });

  }

  initializeLanguage() {
    // Register locale information (ex: dates format)
    registerLocaleData(localeEN, 'en');
    registerLocaleData(localePT, 'pt');

    this.state.language = (localStorage.getItem('language') === 'en' || localStorage.getItem('language') === 'pt') ? localStorage.getItem('language') : 'en';
    this.translateService.use(this.state.language);

    localStorage.setItem('language', this.state.language); // Set language on localStorage individually.

  }

  initializeWebsockets() {

    this.mqttService.connect(this.state.authentication.mqttConnection);

    this.subscriptions.push(
      this.mqttService.onConnect.subscribe(() => { this.logger.info('Websockets connected successfully.'); }),
      this.mqttService.onClose.subscribe(() => { this.logger.error('Websockets disconnected!'); })
    );

  }

  private getDeviceTemplatePath(tree: TreeNodeModel[], deviceTemplate: any) {
    const path = StoreHelper.returnTreeNodePath(tree, deviceTemplate.id, '\\');
    let totalChildren = 0;
    deviceTemplate.path = path.substring(0, path.lastIndexOf('\\'));

    if (deviceTemplate.children) {
      deviceTemplate.children = deviceTemplate.children.map(dtc => {
        const child = this.getDeviceTemplatePath(tree, dtc);
        totalChildren += child.totalChildren; // add all the returned children to the count

        return child;
      });
    } else {
      totalChildren = 1; // if there are no more childrens means that this is the last so we want to return 1
    }

    return { ...deviceTemplate, totalChildren };
  }

  private populateAuthenticationInfo() {
    this.environmentService.getUserInfo().pipe(take(1)).subscribe(
      result => {
        this.state.authentication = {
          ...result,
          ...{
            mqttConnection: {
              protocol: this.ENV.WS_PROTOCOL,
              hostname: this.ENV.WS_HOSTNAME,
              port: this.ENV.WS_PORT,
              username: this.ENV.WS_USERNAME,
              password: this.ENV.WS_PASSWORD,
              keepalive: 60
            }
          }
        };
        this.setState(this.state);
      }
    );
  }


  clearStore() {
    this.setState(new EnvironmentModel());
  }

  getAuthenticationInfo() {
    return this.state.authentication;
  }

  updateUserEntityName(id: string, name: string) {
    this.setState(this.state);
  }


  setLayoutElement(element: string, reference: any) {
    this.state.layout.elements[element] = { reference, data: {} };
    this.setState(this.state);
  }

  actLayoutElement(element: string, data?: object) {

    this.state.layout.elements[element].data = data || {};
    this.setState(this.state);

    return this.state.layout.elements[element].reference;

  }

  getTimezonesList() {
    return this.state.datasets.timezones;
  }

  // Device Templates methods.
  getDeviceTemplate(deviceTemplateId: string): FieldDeviceTemplateModel {

    const arrayWithFindings = this.findNodeOnTree(this.state.datasets.deviceTemplates, deviceTemplateId);

    switch (arrayWithFindings.length) {
      case 0: return null;
      case 1: return arrayWithFindings[0];
      default:
        this.logger.error('EnvironmentStore::getDeviceTemplate: More than 1 device template with the same id', arrayWithFindings);
        return null;
    }

  }

  searchDeviceTemplates(search: string): { id: string, name: string }[] {
    return this.searchNodesOnTree(this.state.datasets.deviceTemplates, search);
  }

  setLanguage(language: string) {
    this.state.language = language;
    this.setState(this.state);
    localStorage.setItem('language', language); // Set language on localStorage individually.
  }


  private findNodeOnTree(tree: TreeNodeModel[], nodeId: string) {

    return tree.map(item => {
      if (item.id === nodeId) {
        return item;
      }

      if (item.children) {
        const found = this.findNodeOnTree(item.children, nodeId).filter(node => node);
        if (found.length) { return found[0]; }
      }

    }).filter(item => item);

  }

  private searchNodesOnTree(tree: TreeNodeModel[], search: string) {

    const searchWords = search.toLowerCase().split(' ');

    return tree.reduce((r: TreeNodeModel[], { children = [], ...o }) => {

      children = this.searchNodesOnTree(children, search);
      if (children.length) {
        r.push(Object.assign(o, { children }));
        return r;
      }

      if (searchWords.every(w => o.name.toLowerCase().includes(w))) {
        const node = this.findNodeOnTree(this.state.datasets.deviceTemplates, o.id);
        r.push(node && node.length === 1 ? node[0] : o);
      }

      return r;

    }, []);

  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
