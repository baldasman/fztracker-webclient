import { DefaultDataModel, FormEngineModel } from '../../catalog/modules/forms';

import { CONSTANTS } from '@app/config';

import { StoreHelper } from '../helpers/store.helper';

const generateRandom = () => `${+new Date()}${Math.floor((Math.random() * 1000) + 1)}`;

export enum SystemGatewayStatusEnum {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  STALE = 'STALE'
}

export enum SystemGatewayConnectionTypeEnum {
  ETHERNET = 0,
  GPRS = 1
}


export class SystemModel {
  id: string;
  entity: string;
  name: string;
  version: string;
  timezone: string;
  coordinates?: { latitude: string, longitude: string };
  gateways: SystemGatewayModel[];
  zones: SystemZoneModel[];
  createdBy: string;
  createdAt: number;
  get updatedAt() { return this.gateways.reduce((accumulator, current) => accumulator > current.updatedAt ? accumulator : current.updatedAt, 0); }

  isDirty: boolean;
  selectedGateway: string;

  constructor(data: Partial<SystemModel>) {
    this.id = data.id || null;
    this.entity = data.entity || null;
    this.name = data.name || null;
    this.version = data.version || null;
    this.timezone = data.timezone || null;
    this.coordinates = data.coordinates || null;
    this.gateways = data.gateways?.map(d => new SystemGatewayModel(d)) || [];
    this.zones = data.zones?.map(d => new SystemZoneModel(d)) || [];
    this.createdBy = data.createdBy || null;
    this.createdAt = data.createdAt || null;

    // When isDirty is not present, it get's dirty only when is created, not when is "opened".
    this.isDirty = data.isDirty !== undefined ? data.isDirty : false;

  }

  setDirty() { this.isDirty = true; return this; }
  setPristine() { this.isDirty = false; return this; }

  cleanSystem() {
    this.setPristine();
    this.gateways.forEach(g => {
      g.setPristine();
      g.fieldDevices.forEach(d => { d.setPristine(); d.applicationBindings.forEach(ab => ab.setPristine()); });
    });
    return this;
  }

}

export class SystemZoneModel {
  id: string;
  name: string;
  path: string;
  children?: SystemZoneModel[];

  constructor(data: SystemZoneModel) {
    this.name = data.name;
    this.children = data.children?.map(d => new SystemZoneModel(d)) || [];
    this.updatePath();
  }

  private updatePath(parentPath?: string) {
    this.path = (parentPath ? `${parentPath}\\` : '') + this.name;
    this.children.forEach(childrenZones => childrenZones.updatePath(this.path));
    this.id = StoreHelper.hashString(this.path).toString();
  }

}

export class SystemGatewayModel {
  id: string;
  name: string;
  timezone: { id: string, offset: string };
  status: { id: SystemGatewayStatusEnum, updatedAt: number };
  modules: SystemGatewayModuleModel[];
  fieldDevices: SystemGatewayFieldDeviceModel[];
  gprsConfiguration: { enabled: boolean; apn?: string; user?: string; password?: string; };
  isDirty: boolean;
  isValid: boolean;
  stateMessages: string[];
  updatedAt: number;

  get serialNumber() { return this.modules.find(m => m.isMaster).serialNumber; }

  counters: { // Incremental HEXADECIMAL counters, to support id's generation.
    lastFieldDevice: string,
    lastApplicationDevice: string
  };

  deployInfo: SystemGatewayDeployInfo; // Store information about running deploy.
  hasUndeployedChanged: boolean;

  constructor(data: Partial<SystemGatewayModel>) {
    this.id = data.id || generateRandom();
    this.name = data.name;
    this.timezone = data.timezone;
    this.modules = (data.modules || []).map(f => new SystemGatewayModuleModel(f));
    this.fieldDevices = (data.fieldDevices || []).map(f => new SystemGatewayFieldDeviceModel(f));
    this.gprsConfiguration = {
      enabled: data.gprsConfiguration?.enabled !== undefined ? data.gprsConfiguration.enabled : false,
      apn: data.gprsConfiguration?.apn || undefined,
      user: data.gprsConfiguration?.user || undefined,
      password: data.gprsConfiguration?.password || undefined
    };
    this.status = data.status || { id: SystemGatewayStatusEnum.OFFLINE, updatedAt: null };
    this.isDirty = data.isDirty !== undefined ? data.isDirty : false; // When isDirty is not present, it get's dirty only when is created, not when is "opened".
    this.updatedAt = data.updatedAt || Math.floor(Date.now() / 1000);

    // This should not happen, but if for any reason counters are not supplied, they are calculated here.
    this.counters = { lastFieldDevice: null, lastApplicationDevice: null };
    if (data.counters?.lastFieldDevice) { this.counters.lastFieldDevice = data.counters.lastFieldDevice; }
    else {
      const maxId = this.fieldDevices.reduce((accumulator, fieldDevice) => {
        const numericId = parseInt(fieldDevice.id.replace('F', ''), 16);
        return (numericId > accumulator ? numericId : accumulator);
      }, 0);
      this.counters.lastFieldDevice = '0x' + maxId.toString(16).toUpperCase().padStart(8, '0');
    }

    if (data.counters?.lastApplicationDevice) { this.counters.lastApplicationDevice = data.counters.lastApplicationDevice; }
    else {
      let applicationDevices: SystemGatewayApplicationObjectModel[] = [];
      this.fieldDevices.forEach(fieldDevice => {
        fieldDevice.applicationBindings.forEach(fieldDeviceGroup => { applicationDevices = applicationDevices.concat(fieldDeviceGroup.applicationObjects); });
      });

      const maxId = applicationDevices.reduce((accumulator, applicationDevice, index) => {
        const numericId = applicationDevice.deviceId ? parseInt(applicationDevice.deviceId.replace('DEV', ''), 16) : index + 1;
        return (numericId > accumulator ? numericId : accumulator);
      }, 0);

      this.counters.lastApplicationDevice = '0x' + maxId.toString(16).toUpperCase().padStart(8, '0');
    }

    this.deployInfo = new SystemGatewayDeployInfo(data.deployInfo || {});
    this.hasUndeployedChanged = data.hasUndeployedChanged || (this.deployInfo.status === 'COMPLETED::OK' && (this.deployInfo.updatedAt || 0) < this.updatedAt) || (this.deployInfo.updatedAt || 0) < this.updatedAt;

    this.updateModelValidations();
    this.updateUsedPorts();

  }

  getNextFieldDeviceId(): string {
    this.counters.lastFieldDevice = '0x' + (parseInt(this.counters.lastFieldDevice, 16) + 1).toString(16).toUpperCase().padStart(8, '0');
    return this.counters.lastFieldDevice;
  }
  getNextApplicationDeviceId(): string {
    this.counters.lastApplicationDevice = '0x' + (parseInt(this.counters.lastApplicationDevice, 16) + 1).toString(16).toUpperCase().padStart(8, '0');
    return this.counters.lastApplicationDevice;
  }

  touch() { this.updatedAt = Math.floor(Date.now() / 1000); return this; }
  setDirty() { this.isDirty = true; this.hasUndeployedChanged = true; return this.touch(); }
  setPristine() { this.isDirty = false; return this.touch(); }

  startDeploy(id: string) { this.deployInfo = { id, isDeploying: true, status: 'STARTED', executionPercentage: 0, message: '', updatedAt: Math.floor(Date.now() / 1000) }; }
  updateDeploy(executionPercentage: number) {
    this.deployInfo.status = 'DEPLOYING';
    this.deployInfo.executionPercentage = executionPercentage;
    this.deployInfo.updatedAt = Math.floor(Date.now() / 1000);
  }
  completeDeploy(status: SystemGatewayDeployInfo['status'], message: string) {
    this.deployInfo.isDeploying = false;
    this.deployInfo.status = status;
    this.deployInfo.executionPercentage = status === 'COMPLETED::OK' ? 100 : this.deployInfo.executionPercentage;
    this.deployInfo.message = message;
    this.deployInfo.updatedAt = Math.floor(Date.now() / 1000);

    this.hasUndeployedChanged = false;
  }


  updateModelValidations() {
    this.isValid = true;
    this.stateMessages = [];

    if (this.modules.length === 0) {
      this.isValid = false;
      this.stateMessages.push('Has no modules');
    }
    if (!this.modules.find(module => module.isMaster === true)) {
      this.isValid = false;
      this.stateMessages.push('One of the modules must be master');
    }
    return this;

  }

  updateStatus(status: { id: SystemGatewayStatusEnum, updatedAt: number }) {
    this.status = status;
  }

  updateUsedPorts() {
    this.modules.forEach(m => {
      m.usedPorts = []; // clear used ports
      this.fieldDevices.forEach(fd => {
        for (const parameter of Object.entries(fd.data)) {
          const paramValue: any = parameter[1]; // get parameters values
          if (typeof paramValue.value === 'string') { // ignore parameters with value !== string
            if (CONSTANTS.moduleTypes[m.type]) { // ignore invalid types
              for (const i of Object.entries(CONSTANTS.moduleTypes[m.type].interfaces)) {
                const iValue: any = i[1];
                iValue.forEach(value => {
                  if (`0x${m.serialNumber}.${value}` === paramValue.value) {
                    m.usedPorts.push(value);
                  }
                });
              }
            }
          }
        }
      });
    });

    return this;
  }

}

export class SystemGatewayDeployInfo {
  id: string;
  isDeploying: boolean;
  status: 'STARTED' | 'DEPLOYING' | 'COMPLETED::OK' | 'COMPLETED::ERROR';
  executionPercentage?: number;
  message: string;
  // log: string;
  updatedAt: number;

  constructor(data: Partial<SystemGatewayDeployInfo>) {
    this.id = data.id || null;
    this.isDeploying = data.isDeploying || null;
    this.status = data.status || null;
    this.executionPercentage = data.executionPercentage || null;
    this.message = data.message || null;
    // this.log = data.log;
    this.updatedAt = data.updatedAt || null;
  }

}

export class SystemGatewayModuleModel {
  id: string;
  serialNumber: string;
  type: string;
  name: string;
  description: string;
  isMaster: boolean;
  connectionType?: SystemGatewayConnectionTypeEnum;
  ipAddress?: string;
  usedPorts?: string[];

  isDeleted: boolean;

  constructor(data: Partial<SystemGatewayModuleModel>) {
    this.id = data.id || generateRandom();
    this.serialNumber = (data.serialNumber || '').toUpperCase().replace('0X', '');

    if (data.type) { this.type = data.type; } // Fetch type when it is not provided.
    else {
      for (const module of Object.entries(CONSTANTS.moduleTypes)) {
        const key = module[0];
        const value = module[1];
        if (parseInt(value.serialNumbers.first, 16) <= parseInt(this.serialNumber, 16) && parseInt(this.serialNumber, 16) <= parseInt(value.serialNumbers.last, 16)) {
          this.type = key;
          break;
        }
      }
    }

    this.name = data.name;
    this.description = data.description;
    this.isMaster = data.isMaster || false;
    this.connectionType = data.connectionType || 0;
    this.ipAddress = data.ipAddress || null;
    this.usedPorts = [];

    this.isDeleted = data.isDeleted !== undefined ? data.isDeleted : false;
  }

  updateModule(data: Partial<SystemGatewayModuleModel>) {
    this.serialNumber = data.serialNumber?.toUpperCase().replace('0X', '') || this.serialNumber;
    this.type = data.type || this.type;
    this.description = data.description || this.description;
    this.name = data.name || this.name;
  }
}

export class SystemGatewayFieldDeviceModel {
  id: string;
  name: string;
  location: string;
  template: {
    id: string,
    name?: string,
    identification: { type: string, version: string },
    path?: string
  };
  data: DefaultDataModel;
  applicationBindings: SystemGatewayApplicationBindingModel[];
  updatedAt: number;

  isDirty: boolean;
  isValid: boolean;
  stateMessages: string[];

  constructor(data: Partial<SystemGatewayFieldDeviceModel>) {
    this.id = data.id || generateRandom();
    this.name = data.name || `New field device ${generateRandom()}`;
    this.location = data.location || null;
    this.template = { id: data.template?.id, name: data.template?.name || null, identification: data.template.identification, path: data.template?.path || null };
    this.data = data.data || null;
    this.applicationBindings = (data.applicationBindings || []).map(f => new SystemGatewayApplicationBindingModel(f));
    this.updatedAt = data.updatedAt || null;

    // When isDirty is not present, it get's dirty only when is created, not when is "opened".
    this.isDirty = data.isDirty !== undefined ? data.isDirty : (data.id ? false : true);

    this.updateModelValidations();
  }

  touch() { this.updatedAt = Math.floor(Date.now() / 1000); return this; }
  setDirty() { this.isDirty = true; return this.touch(); }
  setPristine() { this.isDirty = false; return this.touch(); }

  updateModelValidations() {

    this.isValid = true;
    this.stateMessages = [];

    if (!this.template.id) {
      this.isValid = false;
      this.stateMessages.push('No device template found');
    }
    return this;

  }
}

export class SystemGatewayApplicationBindingModel {
  id: string;
  name: string;
  zone: string;
  // template: { // Futurologia
  //   id: string,
  //   name?: string,
  //   identification: { type: string, version: string }
  // };
  template: { id: string; };
  config: { [key: string]: string };
  applicationObjects: SystemGatewayApplicationObjectModel[];
  updatedAt: number;

  isDirty: boolean;

  constructor(data: Partial<SystemGatewayApplicationBindingModel>) {
    this.id = data.id || generateRandom();
    this.name = data.name || `New binding ${generateRandom()}`;
    this.zone = data.zone || null;
    this.updatedAt = data.updatedAt || null;
    // this.template = { id: data.template?.id, name: data.template?.name || null, identification: data.template?.identification };
    this.template = data.template ? { id: data.template.id } : { id: null };
    this.config = this.config || {};
    this.applicationObjects = (data.applicationObjects || []).map(f => new SystemGatewayApplicationObjectModel(f));

    // When isDirty is not present, it get's dirty only when is created, not when is "opened".
    this.isDirty = data.isDirty !== undefined ? data.isDirty : (data.id ? false : true);
  }

  touch() { this.updatedAt = Math.floor(Date.now() / 1000); return this; }
  setDirty() { this.isDirty = true; return this.touch(); }
  setPristine() { this.isDirty = false; return this.touch(); }

}


export class SystemGatewayApplicationObjectModel {
  key: string;
  deviceId: string;
  name: string;
  zone: { id: string, path: string };
  enabled: boolean;
  updatedAt: number;
  data?: DefaultDataModel;
  form?: Omit<FormEngineModel, 'steps'>;
  rank: number;
  config: {
    id: string;
    type?: string;
    driver?: string;
    zone?: string;
    name?: string;
    description?: string;
    keywords?: string;
    stateless?: boolean;
    visible?: boolean;
    enabled?: boolean;
    parameters?: [
      {
        name?: string;
        value?: string;
      }
    ]
  };

  constructor(data: Partial<SystemGatewayApplicationObjectModel>) {
    this.key = data.key || '';
    this.deviceId = data.deviceId || null;
    this.name = data.name || `New application object ${generateRandom()}`;
    this.zone = data.zone?.path ? { id: StoreHelper.hashString(data.zone.path).toString(), path: data.zone.path } : { id: null, path: null };
    this.enabled = data.enabled || false;
    this.updatedAt = data.updatedAt || null;
    this.data = data.data || null;
    this.form = data.form || null;
    this.rank = data.rank || 0;
    this.config = data.config || null;
  }
}
