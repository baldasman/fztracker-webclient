import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Mixin, Core, Forms, Stores, Animations, FormGroup, FormControl, Validators } from '@app/base';
import { SystemStore, SystemGatewayModel, SystemGatewayModuleModel } from '@core-modules/stores';
import { hexadecimalFormatValidator } from '@core-modules/catalog/modules/forms';

// import { GatewaysService } from '@core-modules/stores/services/gateways.service';

import { GatewayManagementData } from './gateway-management-modal.interface';


@Component({
  selector: 'app-home-modals-gateway-management-modal',
  templateUrl: './gateway-management-modal.component.html',
  styleUrls: ['./gateway-management-modal.component.scss']
})
export class GatewayManagementModalComponent extends Mixin(Core, Forms, Stores, Animations) implements OnInit, OnDestroy {

  title: string;

  gateway: SystemGatewayModel;
  isModuleEdition = false;
  isModuleAdition = false;
  isReplacement = false;

  form: FormGroup;
  get f() { return this.form.controls; }

  selectedModule = {
    id: null as string,
    name: null as string
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GatewayManagementData,
    private dialogRef: MatDialogRef<GatewayManagementModalComponent>,
    // private readonly gatewaysService: GatewaysService,
    private systemStore: SystemStore
  ) { super(); }


  ngOnInit() {

    this.title = this.data.id ? this.translate('labels.edit_module_details') : this.translate('labels.add_gateway');

    if (!this.data.id && !this.data.isModule) {
      this.gateway = new SystemGatewayModel({});
    } else {
      this.gateway = this.systemStore.getGateway(this.data.gatewayId || this.data.id);
      if (this.data.isModule && !this.data.isEdition) {
        this.isModuleAdition = true;
        this.title = this.translate('labels.add_new_module');
      } else if (this.data.isModule && this.data.isEdition) {
        this.isModuleEdition = true;
        this.title = this.translate('labels.edit_module_details');
      } else if (this.data.isReplacement) {
        this.isReplacement = true;
        this.title = this.translate('labels.replace_gateway');
      }
    }

    this.form = this.formBuilder.group({
      id: this.data.id || null,
      serialNumber: [this.data.serialNumber || null, [Validators.required, Validators.minLength(8), Validators.maxLength(8), hexadecimalFormatValidator]],
      description: [this.data.description],
      labelKey: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(16), hexadecimalFormatValidator]],
      type: [this.data.type],
      name: [this.data.name || '', [Validators.required, Validators.minLength(1)]],
      isMaster: true
    });

    if (this.isReplacement) {
      this.form.addControl('newGateway', new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8), hexadecimalFormatValidator]));
      this.form.addControl('newGatewayLabelKey', new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16), hexadecimalFormatValidator]));
      this.form.controls.labelKey.setValue('');
      this.form.get('serialNumber').disable();
    } else if (this.isModuleAdition || this.isModuleEdition) {
      this.form.removeControl('labelKey');
    }

    setTimeout(() => { // Await for component due initialization (controller + view).
      this.updateFormWithModuleRules();
    });
    this.subscriptions.push(
      this.form.valueChanges.subscribe(() => {
        this.updateFormWithModuleRules();
      })
    );
  }


  addGateway() {
    this.loader.show('gateway-management');
    const gateway = {
      system: this.store.system.getSystem().id,
      serialNumber: this.form.get('serialNumber').value,
      labelKey: this.form.get('labelKey').value,
      name: this.form.get('name').value,
      description: this.form.get('description').value
    };

    this.store.system.addGateway$(gateway).pipe(take(1)).subscribe(
      res => {
        this.loader.hide('gateway-management');
        this.notification.success(this.translate('messages.notifications.create.success'));
        this.dialogRef.close({ data: res.id });
      },
      err => {
        this.notification.error(err.resultMessage);
        this.loader.hide('gateway-management');
      }
    );
  }

  addModule() {
    const module = new SystemGatewayModuleModel(this.form.value);
    module.id = null;
    this.systemStore.addGatewayModule(this.data.gatewayId, module);
    this.notification.success(this.translate('messages.notifications.create.success'));
    this.dialogRef.close({ data: this.data.gatewayId });
  }

  editModule() {
    const module = new SystemGatewayModuleModel(this.form.value);
    this.systemStore.editGatewayModule(this.data.gatewayId, module);
    this.notification.success(this.translate('messages.notifications.edit.success'));
    this.dialogRef.close({ data: this.data.gatewayId });
  }

  replaceGateway() {
    this.loader.show('gateway-management');
    const body = {
      newSerialNumber: this.form.get('newGateway').value,
      currentLabelKey: this.form.get('labelKey').value,
      newLabelKey: this.form.get('newGatewayLabelKey').value,
      name: this.form.get('name').value,
      description: this.form.get('description').value
    };

    this.store.system.replaceGateway$(this.data.id, body).pipe(take(1)).subscribe(
      res => {
        this.loader.hide('gateway-management');
        this.notification.success(this.translate('messages.notifications.edit.success'));
        this.dialogRef.close({ data: res.id });
      },
      err => {
        this.loader.hide('gateway-management');
        this.notification.success(err.resultMessage);
      }
    );
  }



  updateFormWithModuleRules() {
    const gateway = this.systemStore.getGateway(this.data.gatewayId || this.data.id);

    const serialNumber: string = this.f.serialNumber.value || '';
    const modulesListWithoutSelf = gateway?.modules.filter(module => module.id !== this.f.id.value) || [];

    // Populate module type.
    if (this.f.serialNumber.errors) {
      this.selectedModule = { id: null, name: null };
      this.f.type.setValue(null, { emitEvent: false }); // No event, or this will trigger valueChanges and loop to infinity...
    }
    else {
      for (const module of Object.entries(this.store.environment.CONSTANTS.moduleTypes)) {
        const key = module[0];
        const value = module[1];
        if (parseInt(value.serialNumbers.first, 16) <= parseInt(serialNumber, 16) && parseInt(serialNumber, 16) <= parseInt(value.serialNumbers.last, 16)) {
          this.selectedModule = { id: key, name: value.name };
          this.f.type.setValue(key, { emitEvent: false }); // No event, or this will trigger valueChanges and loop to infinity...
          break;
        }
      }
    }
    // Reset SerialNumber to original validations and run additional ones if no errors.
    this.f.serialNumber.updateValueAndValidity({ emitEvent: false });
    if (!this.f.serialNumber.errors) {
      // Serial must match a module.
      if (!this.selectedModule.id) {
        this.f.serialNumber.setErrors({ custom: this.translate('messages.errors.invalid_serial_number') });
      }
      // Unique SerialNumber per gateway validation.
      if (modulesListWithoutSelf.find(module => module.serialNumber.toUpperCase() === serialNumber.toUpperCase())) {
        this.f.serialNumber.setErrors({ custom: this.translate('messages.errors.serial_number_already_exists') });
      }
      if (!gateway) {
        let serialNumberExists = false;
        this.systemStore.getGateways().forEach(g => {
          if (g.modules.find(m => m.serialNumber.toUpperCase() === serialNumber.toUpperCase() && m.id !== this.f.id.value)) {
            serialNumberExists = true;
          }
        });
        if (serialNumberExists) {
          this.f.serialNumber.setErrors({ custom: this.translate('messages.errors.serial_number_already_exists') });
        }
      }
    }
  }

  onSave() {
    // trim name so that it isn't sent as spaces only
    this.form.get('name').setValue(this.form.get('name').value.trim());

    if (this.systemStore.getGateways()?.find(g => g.name === this.form.get('name').value)) {
      this.form.get('name').setErrors({ custom: this.translate('messages.errors.already_exists') });
    } else {
      this.form.get('name').setErrors(null, { emitEvent: false });
    }

    if (!this.form.valid) {
      this.formService.showErrors(this.form);
      return;
    }

    if (this.isReplacement) {
      this.replaceGateway();
    } else {
      this.gateway = { ...this.form.value };

      if (!this.data.id && !this.data.isModule) {
        this.addGateway();
      } else if (this.isModuleAdition) {
        this.addModule();
      } else if (this.isModuleEdition) {
        this.editModule();
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() { }

}
