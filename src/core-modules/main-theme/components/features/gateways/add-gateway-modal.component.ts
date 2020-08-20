import { Component, OnInit, Inject } from '@angular/core';
import { take } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Mixin, Core, Dialogs, Forms, Stores, Animations, FormGroup, Validators } from '@app/base';
import { SystemStore } from '@core-modules/stores';

import { hexadecimalFormatValidator } from '@core-modules/catalog/modules/forms';

import { AddGatewayEquipmentSelectionModalComponent } from './add-gateway-equipment-selection-modal.component';


@Component({
  selector: 'app-home-modals-add-gateway-modal',
  templateUrl: './add-gateway-modal.component.html',
  styleUrls: ['./add-gateway-modal.component.scss']
})
export class AddGatewayModalComponent extends Mixin(Core, Dialogs, Forms, Stores, Animations) implements OnInit {

  form: FormGroup;
  get f() { return this.form.controls; }

  selectedModuleType = { id: null as string, name: null as string };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    private dialogRef: MatDialogRef<AddGatewayModalComponent>,
    // private readonly gatewaysService: GatewaysService,
    private systemStore: SystemStore
  ) { super(); }


  ngOnInit() {

    this.form = this.formBuilder.group({
      // id: null,
      serialNumber: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8), hexadecimalFormatValidator]],
      labelKey: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(16), hexadecimalFormatValidator]],
      name: [null, [Validators.required, Validators.minLength(1)]],
      description: [null],
      type: [null],
      isMaster: true
    });

    // if (!this.data.id && !this.data.isModule) {
    //   this.gateway = new SystemGatewayModel({});
    // } else {
    //   this.gateway = this.systemStore.getGateway(this.data.gatewayId || this.data.id);
    //   if (this.data.isModule && !this.data.isEdition) {
    //     this.isModuleAdition = true;
    //     this.title = this.translate('labels.add_new_module');
    //   } else if (this.data.isModule && this.data.isEdition) {
    //     this.isModuleEdition = true;
    //     this.title = this.translate('labels.edit_module_details');
    //   } else if (this.data.isReplacement) {
    //     this.isReplacement = true;
    //     this.title = this.translate('labels.replace_gateway');
    //   }
    // }



    // if (this.isReplacement) {
    //   this.form.addControl('newGateway', new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8), hexadecimalFormatValidator]));
    //   this.form.addControl('newGatewayLabelKey', new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16), hexadecimalFormatValidator]));
    //   this.form.controls.labelKey.setValue('');
    //   this.form.get('serialNumber').disable();
    // } else if (this.isModuleAdition || this.isModuleEdition) {
    //   this.form.removeControl('labelKey');
    // }

    setTimeout(() => { // Await for component due initialization (controller + view).
      this.updateFormWithModuleRules();
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe(() => {
        this.updateFormWithModuleRules();
      })
    );
  }


  updateFormWithModuleRules() {

    const serialNumber: string = this.f.serialNumber.value || '';
    // const modulesListWithoutSelf = gateway?.modules; // .filter(module => module.id !== this.f.id.value) || [];

    // Populate module type.
    if (this.f.serialNumber.errors) {
      this.selectedModuleType = { id: null, name: null };
      this.f.type.setValue(null, { emitEvent: false }); // No event, or this will trigger valueChanges and loop to infinity...
    }
    else {
      for (const module of Object.entries(this.store.environment.CONSTANTS.moduleTypes)) {
        const key = module[0];
        const value = module[1];
        if (parseInt(value.serialNumbers.first, 16) <= parseInt(serialNumber, 16) && parseInt(serialNumber, 16) <= parseInt(value.serialNumbers.last, 16)) {
          this.selectedModuleType = { id: key, name: value.name };
          this.f.type.setValue(key, { emitEvent: false }); // No event, or this will trigger valueChanges and loop to infinity...
          break;
        }
      }
    }

    // Reset SerialNumber to original validations and run additional ones if no errors.
    this.f.serialNumber.updateValueAndValidity({ emitEvent: false });
    if (!this.f.serialNumber.errors) {

      if (!this.selectedModuleType.id) { // Serial must match a module.
        this.f.serialNumber.setErrors({ custom: this.translate('messages.errors.invalid_serial_number') });
      }
      // Unique SerialNumber per gateway validation.
      // if (modulesListWithoutSelf.find(module => module.serialNumber.toUpperCase() === serialNumber.toUpperCase())) {
      //   this.f.serialNumber.setErrors({ custom: this.translate('messages.errors.serial_number_already_exists') });
      // }

      let serialNumberExists = false; // TODO: Improve this code!
      this.systemStore.getGateways().forEach(g => {
        if (g.modules.find(m => m.serialNumber.toUpperCase() === serialNumber.toUpperCase() && m.id !== this.f.id.value)) {
          serialNumberExists = true;
        }
      });
      if (serialNumberExists) { this.f.serialNumber.setErrors({ custom: this.translate('messages.errors.serial_number_already_exists') }); }

    }
  }


  openEquipmentSelectionDialog() {

    this.dialog.open(AddGatewayEquipmentSelectionModalComponent, {
      panelClass: 'dialog-width-50',
      data: {}
    }).afterClosed().subscribe(result => {
      if (result) {
        this.form.get('serialNumber').setValue(result.serialNumber);
        this.form.get('labelKey').setValue(result.labelKey);
      }
    });

  }

  onSave() {
    // trim name so that it isn't sent as spaces only
    // this.form.get('name').setValue(this.form.get('name').value.trim());

    // TODO: This was a bug. to be resolved.
    // if (this.systemStore.getGateways()?.find(g => g.name === this.form.get('name').value)) {
    //   this.form.get('name').setErrors({ custom: this.translate('messages.errors.already_exists') });
    // } else {
    //   this.form.get('name').setErrors(null, { emitEvent: false });
    // }

    if (!this.form.valid) {
      this.formService.showErrors(this.form);
      return;
    }




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

  onCancel() {
    this.dialogRef.close();
  }

}
