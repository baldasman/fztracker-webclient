import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { Mixin, Core, Stores, FormGroup, Forms, Validators, Animations } from '@app/base';

import { SystemGatewayModel, SystemGatewayModuleModel } from '@core-modules/stores';

import { GatewayManagementModalComponent } from './gateway-management-modal.component';

@Component({
  selector: 'app-home-modals-edit-gateway-details-modal',
  templateUrl: './edit-gateway-details-modal.component.html',
  styleUrls: ['./edit-gateway-details-modal.component.scss']
})
export class EditGatewayDetailsModalComponent extends Mixin(Core, Forms, Stores, Animations) implements OnInit {

  gateway: SystemGatewayModel;
  gatewayMasterModule: SystemGatewayModuleModel;

  form: FormGroup;
  get f() { return this.form.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialogRef: MatDialogRef<EditGatewayDetailsModalComponent>,
    private dialog: MatDialog
  ) { super(); }


  ngOnInit() {
    this.gateway = this.store.system.getGateway(this.data.id);
    this.gatewayMasterModule = this.gateway.modules.find(m => m.isMaster);

    this.form = this.formBuilder.group({
      description: [this.gatewayMasterModule.description],
      name: [this.gateway.name || null, [Validators.required]]
    });
  }


  editGateway() {
    this.loader.show('edit-gateway');
    this.store.system.editGateway$(this.gateway.id, this.form.value).pipe(take(1)).subscribe(
      () => {
        this.loader.hide('edit-gateway');
        this.notification.success(this.translate('messages.notifications.edit.success'));
        this.dialogRef.close();
      },
      () => {
        this.loader.hide('edit-gateway');
        this.notification.error(this.translate('messages.notifications.edit.error'));
      }
    );
  }

  openReplaceGatewayModal() {
    this.gatewayMasterModule.name = this.form.value.name;
    this.gatewayMasterModule.description = this.form.value.description;

    this.dialog.open(GatewayManagementModalComponent, {
      panelClass: 'dialog-width-25',
      data: {
        ...this.gatewayMasterModule,
        gatewayId: this.gateway.id,
        isReplacement: true
      }
    }).afterClosed().subscribe(event => {
      if (event) { this.dialogRef.close(); }
    });

  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (!this.form.valid) {
      this.formService.showErrors(this.form);
      return;
    }

    this.editGateway();
  }

}
