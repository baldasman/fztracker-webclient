import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, Observer, Subscription, interval, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { ToastrService } from 'ngx-toastr';
import { cloneDeep } from 'lodash';
import { LoaderService } from '@core-modules/catalog/modules/loader';

import { Store } from '../store.class';
import { EnvironmentStore } from '../environment/environment.store';

import { GenericDialogComponent } from '@core-modules/main-theme/components/shared/dialogs/generic-dialog.component';

import { WsTopicsService } from '../services/ws-topics.service';
import { DeploysService } from '../services/deploys.service';
import { EntitiesService } from './services/entities.service';
import { GatewaysService, CreateGatewayModel, ReplaceGatewayModel } from '../services/gateways.service';
import { SystemService } from './services/system.service';

import { StoreHelper } from '../helpers/store.helper';

import {
  SystemModel,
  SystemGatewayModel,
  SystemGatewayModuleModel,
  SystemGatewayFieldDeviceModel,
  SystemZoneModel,
  SystemGatewayApplicationBindingModel,

  SystemGatewayStatusEnum,
  SystemGatewayConnectionTypeEnum
} from './system.models';

class ApplicationBindingWithLocation extends SystemGatewayApplicationBindingModel {
  locationDetails?: string;

  constructor(data: Partial<ApplicationBindingWithLocation>) {
    super(data);
    this.locationDetails = data.locationDetails;
  }
}

@Injectable()
export class SystemStore extends Store<SystemModel> {

  private gatewaysSubscriptions: { [key: string]: { websockets: Subscription[], deploy: Subscription } } = {};

  constructor(
    private logger: NGXLogger,
    private notification: ToastrService,
    private environmentStore: EnvironmentStore,
    private entitiesService: EntitiesService,
    private wsTopicsService: WsTopicsService,
    private deploysService: DeploysService,
    private gatewaysService: GatewaysService,
    private systemService: SystemService,
    private dialog: MatDialog,
    private t: TranslateService,
    private loader: LoaderService
  ) {
    super('', new SystemModel({}));
  }

  initializeStore$(): Observable<boolean> {
    return of(true); // As this store does not have any async methods, just return TRUE.
  }

  clearStore() {

    this.setState(new SystemModel({}));

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('system::')) { localStorage.removeItem(key); }
    });

    Object.keys(this.gatewaysSubscriptions).forEach(key => {
      this.gatewaysSubscriptions[key].deploy?.unsubscribe();
      this.gatewaysSubscriptions[key].websockets.forEach(s => s.unsubscribe());
      delete this.gatewaysSubscriptions[key];
    });

  }


  loadSystemFromStorage(systemId: string) {

    const ls = this.getStorageState('system::' + systemId) || {};

    if (ls) { return new SystemModel(ls); }
    else { return new SystemModel({}); }

  }


  // System methods.
  getSystem$() { return this.state$; }
  getSystem(): Omit<SystemModel, 'gateways' | 'zones' | 'updatedAt' | 'setDirty' | 'setPristine' | 'cleanSystem'> { // Only necessary fields are returned, as this object can be quite large.
    const { gateways, zones, ...reducedSystem } = this.state; // 'reducedSystem' does not have prior defined keys!
    return reducedSystem;
  }

  getSystemFullStateInfo(): SystemModel {
    return this.state;
  }

  newSystem(system: SystemModel): void {

    if (this.state.id && this.state.id !== system.id) {
      this.closeSystem(); // Close currently opened system.
    }

    system = new SystemModel(system);

    // TODO: Remove deleted gateways. No need to keep them! Maybe created a method on the model itself to purge deleted ones!
    // system.gateways.filter(g => g.modules.find(m => m.isDeleted && m.isMaster)).forEach(g => {
    //   const gwMaster = g.modules.find(m => m.isMaster);
    //   this.notification.warning(this.translate('messages.warnings.gateway_deleted', { gatewayName: g.name, gatewaySN: gwMaster.serialNumber }));
    // });

    this.setStoreId('system::' + system.id);
    this.setStateAndSave(system);

    if (system.id) {

      // Fetch initial gateways status and init status pooling.
      system.gateways.forEach(gateway => { this.fetchGatewayStatus(gateway); });

      // Zones treatment section (check algorithm below).
      this.systemService.getSystemZones(this.state.id).subscribe(
        response => {

          // 01: Fetch currently deployed zones.
          // 02: Parse zones from all necessary devices.
          // 03: Build a tree with all the devices zones.
          // 04: Merge zones from devices, with zones from current deploy.
          const devicesZones: string[] = [];

          // Fetch zones from all application devices, to merge with saved ones below.
          system.gateways.forEach(gateway => {
            gateway.fieldDevices.forEach(fieldDevice => {
              fieldDevice.applicationBindings.forEach(group => {
                group.applicationObjects.forEach(applicationObject => {
                  devicesZones.push(applicationObject.zone.path);
                });
              });
            });
          });

          const deviceZonesTree = StoreHelper.createTreeFromFlatListArray(devicesZones);
          this.setZones(StoreHelper.mergeTrees(response, deviceZonesTree, 'name'));
        },
        () => { this.setZones([]); });

    }

  }

  newSystem$(system: SystemModel) {

    return new Observable((observer: Observer<SystemModel>) => {
      this.systemService.createSystem(system).pipe(take(1)).subscribe(
        response => {
          system.id = response.id;
          this.newSystem(system);

          observer.next(system);
          observer.complete();
        },
        error => {
          observer.error(error.error);
          observer.complete();
        }
      );
    });

  }

  editSystem$(system: string, body: SystemModel) {

    return new Observable((observer: Observer<SystemModel>) => {
      this.systemService.editSystem(system, body).pipe(take(1)).subscribe(
        () => {
          this.state.name = body.name;
          this.state.timezone = body.timezone;
          this.state.coordinates = body.coordinates;
          this.setStateAndSave(this.state);

          observer.next(this.state);
          observer.complete();
        },
        error => {
          observer.error(error.error);
          observer.complete();
        }
      );
    });

  }

  openSystem$(systemId: string) {

    return new Observable((observer: Observer<SystemModel>) => {
      forkJoin(
        [
          this.entitiesService.getEntitiesList(),
          this.systemService.openSystem(systemId)
        ]
      ).subscribe(
        result => {

          // TODO: emit warnings for the deleted GWs. openSystem response model is incomplete!
          // loadedSystem.gateways.filter(g => g.modules.find(m => m.isDeleted && m.isMaster)).forEach(g => {
          //   const gwMaster = g.modules.find(m => m.isMaster);
          //   this.notification.warning(this.translate('messages.warnings.gateway_deleted', { gatewayName: g.name, gatewaySN: gwMaster.serialNumber }));
          // });

          const loadedSystem = new SystemModel(result[1]);
          const storageSystem = this.loadSystemFromStorage(systemId);

          const entity = result[0].entities.find(e => e.id === loadedSystem.entity);
          if (entity) {
            this.environmentStore.updateUserEntityName(entity.id, entity.name);
          }

          // If server information is more recent, load it!
          if (loadedSystem.updatedAt >= storageSystem.updatedAt) {
            this.newSystem(loadedSystem);
            observer.next(loadedSystem);
            observer.complete();
            return;
          }

          // If local information is more recent, ask user to choose!
          this.loader.hide('splash-screen-loader');
          this.dialog.open(GenericDialogComponent, {
            panelClass: 'dialog-width-50',
            data: {
              title: this.t.instant('features.dialogs.local_information_detected.title'),
              message: this.t.instant('features.dialogs.local_information_detected.message', { systemName: loadedSystem.name }),
              actions: [
                { id: 'loadFromStore', class: 'btn-primary', label: this.t.instant('features.dialogs.local_information_detected.load_from_local', { systemName: loadedSystem.name }) },
                { id: 'loadFromServer', class: 'btn-danger', label: this.t.instant('features.dialogs.local_information_detected.load_from_server', { systemName: loadedSystem.name }) }
              ],
              allowDismiss: false
            }
          }).afterClosed().subscribe(evt => {
            switch (evt) {
              case 'loadFromStore':
                this.newSystem(storageSystem);
                break;
              case 'loadFromServer':
                this.newSystem(loadedSystem);
                break;
            }
            observer.next(loadedSystem);
            observer.complete();
          });

        },
        error => {
          this.notification.error(this.t.instant('messages.errors.loading_resource', { resource: this.t.instant('dictionary.system') }));
          observer.error(error.error);
          observer.complete();
        }
      );

    });

  }

  saveSystem$() {

    const system = cloneDeep(this.state).cleanSystem();
    delete system.selectedGateway;

    return new Observable((observer: Observer<boolean>) => {
      this.systemService.saveSystem(system).subscribe(
        () => {
          this.state.gateways = system.gateways;
          this.state.setPristine();
          this.setStateAndSave(this.state);

          observer.next(true);
          observer.complete();
        },
        error => {
          observer.error(error.error);
          observer.complete();
        }
      );
    });

  }

  closeSystem() {

    if (localStorage['system::' + this.state.id]) { localStorage.removeItem('system::' + this.state.id); }

    this.setState(new SystemModel({}));

    Object.keys(this.gatewaysSubscriptions).forEach(key => {
      this.gatewaysSubscriptions[key].deploy?.unsubscribe();
      this.gatewaysSubscriptions[key].websockets.forEach(s => s.unsubscribe());
      delete this.gatewaysSubscriptions[key];
    });


  }


  // System gateways methods.
  selectGateway(id: string) {
    this.state.selectedGateway = id;
    this.setState(this.state);
  }

  getGateways(): SystemGatewayModel[] {
    return this.state.gateways;
  }

  getDirtyGateways(): SystemGatewayModel[] {
    return this.state?.gateways.filter(g => g.isDirty) || [];
  }

  getGateway(gatewayId?: string): SystemGatewayModel {
    gatewayId = gatewayId || this.state.selectedGateway;
    return this.state.gateways.find(item => item.id === gatewayId);
  }

  getGatewayCounters(gatewayId?: string): SystemGatewayModel['counters'] {
    gatewayId = gatewayId || this.state.selectedGateway;
    return this.getGateway().counters;
  }

  addGateway$(data: CreateGatewayModel) {

    return new Observable((observer: Observer<{ id: string }>) => {
      this.gatewaysService.createGateway(data).pipe(take(1)).subscribe(
        response => {
          const gateway = new SystemGatewayModel({ ...data, id: response.id });
          const module = new SystemGatewayModuleModel({ ...data, id: response.id, isMaster: true });

          gateway.modules.push(module);
          gateway.setDirty();
          gateway.updateModelValidations();

          this.state.gateways.push(gateway);
          this.state.setDirty();

          this.fetchGatewayStatus(gateway);

          this.setStateAndSave(this.state);

          observer.next(response);
          observer.complete();
        },
        error => {
          observer.error(error.error);
          observer.complete();
        }
      );
    });
  }


  private fetchGatewayStatus(gateway: SystemGatewayModel) {

    const serialNumber = gateway.modules.find(m => m.isMaster).serialNumber.toUpperCase();

    // Get initial status
    this.gatewaysService.getGatewayStatus(gateway.id).pipe(take(1)).subscribe(
      response => { this.onGatewayStatusResponse(gateway, response); }
    );

    // Reset subscriptions state.
    this.gatewaysSubscriptions[gateway.id]?.websockets.forEach(s => s.unsubscribe());
    this.gatewaysSubscriptions[gateway.id] = { websockets: [], deploy: null };

    this.gatewaysSubscriptions[gateway.id].websockets.push(
      this.wsTopicsService.observeConnection(serialNumber).subscribe(event => {
        this.onGatewayStatusResponse(gateway, event.message);
      })
    );

    this.gatewaysSubscriptions[gateway.id].websockets.push(
      this.wsTopicsService.observeDeploy(serialNumber).subscribe(event => {

        const eventGateway = this.state.gateways.find(g => g.serialNumber === event.gatewaySerialNumber);

        if (eventGateway) {

          this.handleDeployTimeout(eventGateway, 'reset');

          if (event.isDeploying) {
            eventGateway.updateDeploy(event.executionPercentage);
          } else if (event.isCompleted) {

            this.handleDeployTimeout(eventGateway, 'complete');
            eventGateway.completeDeploy(event.status, event.message);

            switch (event.status) {
              case 'COMPLETED::OK':
                this.notification.success(this.t.instant('features.deploy.notifications.deploy_successful', { gateway: event.gatewaySerialNumber }));
                break;
              case 'COMPLETED::ERROR':
                this.notification.error(this.t.instant('features.deploy.notifications.deploy_failed', { gateway: event.gatewaySerialNumber }));
                break;
            }
          }

          // eventGateway.deployInfo.log += response.log;

          this.setStateAndSave(this.state);
        }

      })
    );

    // get status every 30 seconds - the first call is only made after 30 seconds
    // this.gatewaysSubscriptions[gateway.id] =
    //   interval(30000)
    //     .pipe(
    //       flatMap(() => this.gatewaysService.getGatewayStatus(gateway.id))
    //     )
    //     .subscribe(res => {
    //       this.onGatewayStatusResponse(gateway, res);
    //     });

  }

  private onGatewayStatusResponse(gateway: SystemGatewayModel, response: { ipAddress?: string, connectionType?: SystemGatewayConnectionTypeEnum, status: { id: SystemGatewayStatusEnum, updatedAt: number } }) {
    const module = gateway.modules.find(m => m.isMaster);
    if (module) {
      module.ipAddress = response.ipAddress;
      module.connectionType = response.connectionType;
    }
    gateway.updateStatus(response.status);
    this.setStateAndSave(this.state);
  }


  editGateway$(gatewayId: string, data: { name: string, description: string }) {

    return new Observable((observer: Observer<{ id: string }>) => {
      this.gatewaysService.editGateway(gatewayId, data).pipe(take(1)).subscribe(
        () => {
          const gateway = this.getGateway(gatewayId);

          if (gateway) {

            const module = gateway.modules.find(g => g.isMaster);

            module.name = data.name;
            module.description = data.description;

            gateway.name = data.name;
            gateway.setDirty();
            gateway.updateModelValidations();

            this.state.setDirty();

            this.setStateAndSave(this.state);

          }

          observer.next({ id: gatewayId });
          observer.complete();
        },
        error => {
          observer.error(error.error);
          observer.complete();
        }
      );
    });
  }

  replaceGateway$(gatewayId: string, data: ReplaceGatewayModel) {

    return new Observable((observer: Observer<{ id: string }>) => {
      this.gatewaysService.replaceGateway(gatewayId, data).pipe(take(1)).subscribe(
        response => {
          const gateway = this.getGateway(gatewayId);
          if (gateway) {
            const gatewayModule = gateway.modules.find(m => m.isMaster);
            gateway.name = data.name;
            gatewayModule.name = data.name;
            gatewayModule.serialNumber = data.newSerialNumber;
            gatewayModule.description = data.description;
            this.editGatewayModule(gatewayId, gatewayModule);
            this.setStateAndSave(this.state);
          }

          observer.next(response);
          observer.complete();
        },
        error => {
          observer.error(error.error);
          observer.complete();
        }
      );
    });

  }

  deleteGateway$(id: string, queryParams: { labelKey: string }) {

    return new Observable((observer: Observer<{ id: string }>) => {
      this.gatewaysService.deleteGateway(id, queryParams).pipe(take(1)).subscribe(
        () => {
          this.state.gateways = this.state.gateways.filter(item => item.id !== id);

          this.setStateAndSave(this.state);

          Object.keys(this.gatewaysSubscriptions).forEach(key => {
            if (key === id) {
              this.gatewaysSubscriptions[key].deploy?.unsubscribe();
              this.gatewaysSubscriptions[key].websockets.forEach(s => s.unsubscribe());
              delete this.gatewaysSubscriptions[key];
            }
          });

          observer.next({ id });
          observer.complete();
        },
        error => {
          observer.error(error.error);
          observer.complete();
        }
      );
    });

  }

  editGatewayCommunications(gatewayId: string, data: SystemGatewayModel['gprsConfiguration']) {

    const gateway = this.state.gateways.find(item => item.id === gatewayId);

    this.state.setDirty();

    gateway.gprsConfiguration = data;
    gateway.setDirty();

    this.setStateAndSave(this.state);

  }

  triggerGatewaysDeploys$(gateways: { id: string, notes: string }[]) {
    return new Observable((observer: Observer<{ id: string }>) => {
      this.deploysService.createDeploy(this.getSystem().id, gateways).pipe(take(1)).subscribe(
        deploys => {

          deploys.forEach(deploy => {
            const gateway = this.getGateway(deploy.gatewayId);
            gateway.startDeploy(deploy.id);

            this.setStateAndSave(this.state);

            this.handleDeployTimeout(gateway, 'reset');

          });

          this.notification.success(this.t.instant('features.deploy.notifications.deploy_started'));

          observer.next(null);
          observer.complete();
        },
        error => {
          this.logger.info(`Error triggering the deploy`);
          observer.error(error.error);
          observer.complete();
        }
      );
    });

  }

  private handleDeployTimeout(gateway: SystemGatewayModel, action: 'reset' | 'complete') {
    // NOTE: It should be a better way of resetting an interval/timeout, but i'm just not inspired.
    // If someone is inspired, please do better than me!
    this.gatewaysSubscriptions[gateway.id]?.deploy?.unsubscribe();

    if (action === 'reset') {
      this.gatewaysSubscriptions[gateway.id].deploy = interval(30000).pipe(take(1)).subscribe(() => {
        this.logger.info(`Deploy for ${gateway.name} timed out`);
        gateway.completeDeploy('COMPLETED::ERROR', 'Timeout');
        this.setStateAndSave(this.state);
      });
    }

  }


  // System Gateways Modules methods.
  addGatewayModule(gatewayId: string, data: SystemGatewayModuleModel) {

    const gateway = this.state.gateways.find(item => item.id === gatewayId);

    data.isMaster = false;

    gateway.modules.push(new SystemGatewayModuleModel(data));
    gateway.setDirty();

    this.state.setDirty();

    this.setStateAndSave(this.state);

  }

  editGatewayModule(gatewayId: string, data: SystemGatewayModuleModel) {

    const gateway = this.state.gateways.find(item => item.id === gatewayId);
    const module = gateway.modules.find(item => item.id === data.id);

    gateway.setDirty();
    module.updateModule(data);
    this.state.setDirty();

    this.setStateAndSave(this.state);

  }

  deleteGatewayModule(gatewayId: string, gatewayModuleId: string) {

    const gateway = this.state.gateways.find(item => item.id === gatewayId);
    const moduleIndex = gateway.modules.findIndex(item => item.id === gatewayModuleId);

    gateway.setDirty();
    gateway.modules.splice(moduleIndex, 1);
    this.state.setDirty();

    this.setStateAndSave(this.state);

  }

  getModules(gatewayId?: string): SystemGatewayModuleModel[] {
    gatewayId = gatewayId || this.state.selectedGateway;
    return this.state.gateways.find(item => item.id === gatewayId)?.modules || [];
  }

  getMasterModule(gatewayId?: string): SystemGatewayModuleModel {
    gatewayId = gatewayId || this.state.selectedGateway;
    return this.getModules(gatewayId).find(item => item.isMaster);
  }

  getModulesInterfaces(gatewayId?: string, interfaceTypes?: string[]): { id: string, value: string, group: string, disabled: boolean }[] {

    gatewayId = gatewayId || this.state.selectedGateway;
    interfaceTypes = !interfaceTypes || interfaceTypes.length === 0 ? ['analogInputs', 'analogOutputs', 'digitalOutputs', 'pwmOutputs'] : interfaceTypes;

    const interfaces: { id: string, value: string, group: string, disabled: boolean }[] = [];

    this.state.gateways.find(item => item.id === gatewayId)?.modules.forEach(module => {
      interfaceTypes.forEach(interfaceType => {
        this.environmentStore.CONSTANTS.moduleTypes[module.type]?.interfaces[interfaceType].forEach((port: string) => {
          interfaces.push({ id: `0x${module.serialNumber}.${port}`, value: `0x${module.serialNumber}.${port}`, group: module.serialNumber, disabled: module.usedPorts.includes(port) ? true : false });
        });
      });
    });

    return interfaces;

  }

  // System Gateways Devices methods.
  getFieldDevices(gatewayId?: string): SystemGatewayFieldDeviceModel[] { // TODO: This is not correcly typed!
    gatewayId = gatewayId || this.state.selectedGateway;
    const fieldDevices = this.state.gateways.find(item => item.id === gatewayId)?.fieldDevices || [];
    let fieldDevicesWithLocation = [];
    fieldDevicesWithLocation = fieldDevices.map(fd => {
      const applicationBindings = fd.applicationBindings.map(g => {
        return { ...g, locationDetails: StoreHelper.returnTreeNodePath(this.getZones(), g.zone) };
      });
      return {
        ...fd, applicationBindings, locationDetails: StoreHelper.returnTreeNodePath(this.getZones(), fd.location)
      };
    });
    return fieldDevicesWithLocation;
  }

  getDirtyFieldDevices(): SystemGatewayFieldDeviceModel[] {
    let devices = [];
    this.state.gateways.forEach(g => {
      devices = devices.concat(g.fieldDevices.filter(d => d.isDirty));
    });
    return devices;
  }

  getFieldDevice(deviceId: string): SystemGatewayFieldDeviceModel {

    return this.getGateway().fieldDevices.find(fieldDevice => fieldDevice.id === deviceId) || {} as SystemGatewayFieldDeviceModel;

  }

  addFieldDevice(gatewayId: string, data: SystemGatewayFieldDeviceModel) {

    gatewayId = gatewayId || this.state.selectedGateway;

    const gateway = this.state.gateways.find(item => item.id === gatewayId);

    if (!data.template.name) { data.template.name = this.environmentStore.getDeviceTemplate(data.template.id)?.name || null; }
    data.id = 'F' + gateway.getNextFieldDeviceId().replace('0x', '');
    data.touch();

    gateway.fieldDevices.push(data);
    gateway.updateUsedPorts().setDirty();

    this.state.setDirty();

    this.setStateAndSave(this.state);
  }

  editFieldDevice(gatewayId: string, deviceId: string, data: SystemGatewayFieldDeviceModel) {

    gatewayId = gatewayId || this.state.selectedGateway;

    if (!data.template.name) { data.template.name = this.environmentStore.getDeviceTemplate(data.template.id)?.name || null; }

    const gateway = this.state.gateways.find(item => item.id === gatewayId);
    const fieldDeviceArrayIndex = gateway.fieldDevices.findIndex(device => device.id === deviceId);

    data.setDirty();
    data.applicationBindings = gateway.fieldDevices[fieldDeviceArrayIndex].applicationBindings; // Keep assotiated application devices groups.
    data.updatedAt = Math.floor(Date.now() / 1000);

    gateway.fieldDevices[fieldDeviceArrayIndex] = new SystemGatewayFieldDeviceModel({ ...data, ...{ id: deviceId } });
    gateway.updateUsedPorts().setDirty();

    this.state.setDirty();

    this.setStateAndSave(this.state);
  }

  deleteFieldDevice(gatewayId: string, deviceId: string) {
    gatewayId = gatewayId || this.state.selectedGateway;

    const gateway = this.state.gateways.find(item => item.id === gatewayId);
    gateway.fieldDevices = gateway.fieldDevices.filter(item => item.id !== deviceId);
    gateway.updateUsedPorts().setDirty();

    this.state.setDirty();

    this.setStateAndSave(this.state);
  }

  // System Gateways Field Devices Groups methods.
  getApplicationBindings(gatewayId?: string): SystemGatewayApplicationBindingModel[] & { locationDetails?: string } {

    gatewayId = gatewayId || this.state.selectedGateway;

    let appDevices = this.state.gateways.find(item => item.id === gatewayId)?.fieldDevices
      .map(fd => fd.applicationBindings)
      .reduce((previous, current) => [...previous, ...current], [])
      .map(group => group);

    // add location details
    appDevices = (appDevices || []).map(ap => {
      return new ApplicationBindingWithLocation({ ...ap, locationDetails: StoreHelper.returnTreeNodePath(this.getZones(), ap.zone) });
    });

    return appDevices;
  }

  getApplicationBinding(applicationBindingId: string): SystemGatewayApplicationBindingModel {
    return this.getApplicationBindings().find(applicationBinding => applicationBinding.id === applicationBindingId);
  }

  getApplicationBindingsWithFieldDeviceId(groupId: string, gatewayId?: string): SystemGatewayApplicationBindingModel & { fieldDeviceId: string } {

    gatewayId = gatewayId || this.state.selectedGateway;

    const fieldDevices = this.state.gateways.find(item => item.id === gatewayId)?.fieldDevices || [];
    let group;
    fieldDevices.forEach(fd => {
      if (fd.applicationBindings.find(g => g.id === groupId)) {
        group = {
          ...fd.applicationBindings.find(g => g.id === groupId),
          fieldDeviceId: fd.id
        };
      }
    });

    return group;
  }

  addApplicationBinding(gatewayId: string, fieldDeviceId: string, data: SystemGatewayApplicationBindingModel) {

    gatewayId = gatewayId || this.state.selectedGateway;

    const gateway = this.state.gateways.find(item => item.id === gatewayId);
    const fieldDevice = gateway.fieldDevices.find(item => item.id === fieldDeviceId);

    data.applicationObjects.map(applicationDevice => {
      applicationDevice.deviceId = 'DEV' + gateway.getNextApplicationDeviceId().replace('0x', '');
      return applicationDevice;
    });
    data.setDirty();

    fieldDevice.applicationBindings.push(new SystemGatewayApplicationBindingModel(data));
    gateway.setDirty();
    fieldDevice.setDirty();
    this.state.setDirty();

    this.setStateAndSave(this.state);

  }

  editApplicationBinding(gatewayId: string, fieldDeviceId: string, applicationDeviceId: string, data: SystemGatewayApplicationBindingModel) {

    gatewayId = gatewayId || this.state.selectedGateway;

    const gateway = this.state.gateways.find(item => item.id === gatewayId);
    const fieldDevice = gateway.fieldDevices.find(item => item.id === fieldDeviceId);
    const arrayIndex = fieldDevice.applicationBindings.findIndex(group => group.id === applicationDeviceId);

    fieldDevice.applicationBindings[arrayIndex] = new SystemGatewayApplicationBindingModel(data);
    fieldDevice.applicationBindings[arrayIndex].setDirty();
    gateway.setDirty();
    fieldDevice.setDirty();
    this.state.setDirty();

    this.setStateAndSave(this.state);

  }

  deleteApplicationBinding(gatewayId: string, deviceId: string, groupId: string) {

    gatewayId = gatewayId || this.state.selectedGateway;

    const gateway = this.state.gateways.find(item => item.id === gatewayId);
    const fieldDevice = gateway.fieldDevices.find(item => item.id === deviceId);

    fieldDevice.applicationBindings = fieldDevice.applicationBindings.filter(item => item.id !== groupId);
    gateway.setDirty();
    this.state.setDirty();

    this.setStateAndSave(this.state);

  }


  getZones(): SystemZoneModel[] {
    return this.state.zones;
  }

  setZones(zones: SystemZoneModel[]) {

    this.state.zones = zones.map(z => new SystemZoneModel(z));
    this.setStateAndSave(this.state);

  }

}
