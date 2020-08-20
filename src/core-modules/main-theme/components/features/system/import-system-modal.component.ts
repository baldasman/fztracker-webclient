import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Mixin, Core, Stores, Animations, UrlModel } from '@app/base';
import { SystemModel, SystemGatewayModel, SystemGatewayModuleModel } from '@core-modules/stores';

import { UploadConfigurationModel, UploadEventModel } from '../../../../catalog/modules/uploads';

@Component({
  selector: 'app-home-modals-import-system-modal',
  templateUrl: './import-system-modal.component.html',
})
export class ImportSystemModalComponent extends Mixin(Core, Stores, Animations) implements OnInit {

  private importedGateways: SystemGatewayModel[];

  numberOfInvalidGateways: number;

  visibleContent = {
    fileUpload: true,
    uploadResults: false
  };

  uploadConfig: UploadConfigurationModel;

  table = {
    displayedColumns: ['gateway', 'modules', 'field-devices', 'application-devices'],
    dataSource: new MatTableDataSource([] as (SystemGatewayModel & { fieldDevicesNumber: number, applicationDevicesNumber: number })[]),
  };


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { type: string },
    public dialogRef: MatDialogRef<ImportSystemModalComponent>
  ) { super(); }


  ngOnInit() {

    let url: string;
    if (this.data.type === 'webtool') {
      url = new UrlModel(this.store.environment.ENV.API_URL).setPath('workspace/v1/systems/import').setQueryParams({ system: this.store.system.getSystem().id }).buildUrl();
    } else {
      url = new UrlModel(this.store.environment.ENV.API_URL).setPath('workspace/v1/systems/import/desktop').setQueryParams({ system: this.store.system.getSystem().id }).buildUrl();
    }

    this.uploadConfig = new UploadConfigurationModel({
      url,
      acceptedFiles: this.data.type === 'webtool' ? '.isfx' : '.iwfx',
      maxFiles: 1,
      style: { heightLevel: 4 }
    });

    this.numberOfInvalidGateways = 0;

  }


  onFileEventReceived(event) {

    // console.log('COMP SUCCESS', event);

  }


  onUploadSuccess(event: UploadEventModel<{ data: SystemModel }>) {

    this.numberOfInvalidGateways = 0;

    this.importedGateways = (event.response.data.gateways || []).map(gateway => {

      // Module receives an additional parameter 'isSystemValid' that indicates if the gateway belongs/is valid on that system.
      const masterModule = gateway.modules.find(m => m.isMaster) as SystemGatewayModuleModel & { isSystemValid: boolean };

      if (!masterModule) { // If this happens, something terribly wrong happened on API.
        this.numberOfInvalidGateways += 1;
        return null;
      }

      // If this happens, gateway does not belong to current system.
      if (!this.store.system.getGateways().find(gw => gw.serialNumber === masterModule.serialNumber) || !masterModule.isSystemValid) {
        this.numberOfInvalidGateways += 1;
        return null;
      }

      gateway = new SystemGatewayModel(gateway).setDirty();
      gateway.modules = gateway.modules.filter(module => !module.isDeleted); // Remove not existing modules.
      gateway.fieldDevices.map(fieldDevice => fieldDevice.setDirty() ); // Set all field devices as dirty
      return gateway;

    }).filter(gateway => gateway);

    this.table.dataSource.data = this.importedGateways.map((gateway: (SystemGatewayModel & { fieldDevicesNumber: number, applicationDevicesNumber: number })) => {
      gateway.fieldDevicesNumber = gateway.fieldDevices.length;
      gateway.applicationDevicesNumber = gateway.fieldDevices.reduce((fieldDeviceAccumulator, fieldDevice) => {
        return fieldDeviceAccumulator + fieldDevice.applicationBindings.reduce((applicationBindingAccumulator, applicationBinding) => applicationBindingAccumulator + applicationBinding.applicationObjects.length, 0);
      }, 0);
      return gateway;
    });

    this.visibleContent = { fileUpload: false, uploadResults: true };

  }

  onUploadError(event: UploadEventModel<{ data: {} }>) {

    // console.log('Error', event); // TODO: treat this....

  }


  onSave() {

    const system = this.store.system.getSystemFullStateInfo().setDirty();

    this.importedGateways.forEach(gateway => {
      const arrayIndex = system.gateways.findIndex(gw => gw.serialNumber === gateway.serialNumber);
      system.gateways[arrayIndex] = gateway;
    });

    this.store.system.newSystem(system);
    this.notification.success(this.translate('features.system_management.messages.project_imported_successfully'));
    this.router.navigateByUrl(`/${system.id}`);
    this.dialogRef.close();

  }

  onReset() {
    this.visibleContent = { fileUpload: true, uploadResults: false };
  }

  onCancel() {
    this.dialogRef.close();
  }

}
