import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Mixin, Core, Stores, Forms, FormGroup } from '@app/base';

import { SystemGatewayModel } from '@core-modules/stores';


@Component({
  selector: 'app-home-modals-edit-gateway-communications-modal',
  templateUrl: './edit-gateway-communications-modal.component.html'
})
export class EditGatewayCommunicationsModalComponent extends Mixin(Core, Forms, Stores) implements OnInit {

  gateway: SystemGatewayModel;

  form: FormGroup;
  get f() { return this.form.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialogRef: MatDialogRef<EditGatewayCommunicationsModalComponent>
  ) { super(); }


  ngOnInit() {

    this.gateway = this.store.system.getGateway(this.data.id);

    this.form = this.formBuilder.group({
      enabled: [this.gateway.gprsConfiguration.enabled],
      apn: [this.gateway.gprsConfiguration.apn],
      user: [this.gateway.gprsConfiguration.user],
      password: [this.gateway.gprsConfiguration.password]
    });

    this.updateFormRules();

    this.subscriptions.push(
      this.form.get('enabled').valueChanges.subscribe(() => this.updateFormRules())
    );

  }


  updateFormRules() {

    if (this.form.get('enabled').value) {
      this.form.get('apn').enable();
      this.form.get('user').enable();
      this.form.get('password').enable();
    } else {
      this.form.get('apn').disable();
      this.form.get('user').disable();
      this.form.get('password').disable();
    }

  }


  onCancel() {
    this.dialogRef.close();
  }

  onSave() {

    if (!this.form.valid) {
      this.formService.showErrors(this.form);
      return;
    }

    this.store.system.editGatewayCommunications(this.gateway.id, this.form.getRawValue());
    this.dialogRef.close();

  }

}
