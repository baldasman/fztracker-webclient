import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { take } from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


import { Mixin, Core, Stores, Animations } from '@app/base';
import { SystemGatewayModel, SystemGatewayModuleModel } from '@core-modules/stores';

import { EditGatewayDetailsModalComponent } from './edit-gateway-details-modal.component';
import { EditGatewayCommunicationsModalComponent } from './edit-gateway-communications-modal.component';
import { GatewayManagementModalComponent } from './gateway-management-modal.component';
import { DeleteGatewayModalComponent } from './delete-gateway-modal.component';

import { GatewayManagementData } from './gateway-management-modal.interface';


@Component({
  selector: 'app-home-modals-edit-gateway-modal',
  templateUrl: './edit-gateway-modal.component.html',
  styleUrls: ['./edit-gateway-modal.component.scss'],
  animations: [
    trigger('grow', [
      state('small', style({ height: '0px', visibility: 'hidden', overflow: 'hidden' })),
      state('big', style({ height: '*', overflow: 'hidden' })),
      transition('small <=> big', [
        animate(250)
      ])
    ])
  ]
})
export class EditGatewayModalComponent extends Mixin(Core, Stores, Animations) implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  gateway: SystemGatewayModel;
  gatewayMasterModule: SystemGatewayModuleModel;

  collapsed = true;

  table = {
    displayedColumns: ['serialNumber', 'type', 'description', 'actions'],
    dataSource: new MatTableDataSource([] as SystemGatewayModuleModel[])
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditGatewayModalComponent>
  ) { super(); }


  ngOnInit() {

    this.gateway = this.store.system.getGateway(this.data.id);
    this.gatewayMasterModule = this.store.system.getMasterModule(this.data.id);

    this.table.dataSource.data = this.gateway.modules.filter(m => !m.isMaster);
    this.table.dataSource.sort = this.sort;

  }



  openGatewayDetailsDialog() {

    this.dialog.open(EditGatewayDetailsModalComponent, {
      panelClass: 'dialog-width-25',
      data: this.gateway
    }).afterClosed().subscribe((data: SystemGatewayModuleModel) => {
      if (!data) { return; }

      this.gateway = this.store.system.getGateway(this.data.id);

      this.table.dataSource.data = this.gateway.modules.filter(m => !m.isMaster);
      this.table.dataSource.sort = this.sort;
    });

  }


  openGatewayCommunicationsDialog() {

    this.dialog.open(EditGatewayCommunicationsModalComponent, {
      panelClass: 'dialog-width-25',
      data: this.gateway
    }).afterClosed().subscribe(() => {
      this.gateway = this.store.system.getGateway(this.data.id);
      this.table.dataSource.data = this.gateway.modules.filter(m => !m.isMaster);
      this.table.dataSource.sort = this.sort;
    });

  }



  openAddModuleModalDialog() {

    this.dialog.open(GatewayManagementModalComponent, {
      panelClass: 'dialog-width-25',
      data: { id: null, gatewayId: this.gateway.id, isModule: true, isEdition: false }
    }).afterClosed().subscribe((data: SystemGatewayModuleModel) => {

      if (!data) { return; }

      this.gateway = this.store.system.getGateway(this.data.id);

      this.table.dataSource.data = this.gateway.modules.filter(m => !m.isMaster);
      this.table.dataSource.sort = this.sort;
    });
  }

  openEditModuleModalDialog(tableRow?: SystemGatewayModuleModel) {
    const dialogRef = this.dialog.open(GatewayManagementModalComponent, {
      panelClass: 'dialog-width-25',
      data: {
        id: tableRow.id,
        gatewayId: this.gateway.id,
        serialNumber: tableRow.serialNumber,
        name: tableRow.name,
        description: tableRow.description,
        isModule: true,
        isEdition: true
      }
    });

    dialogRef.afterClosed().subscribe((data: SystemGatewayModuleModel) => {
      if (!data) {
        return;
      }

      this.gateway = this.store.system.getGateway(this.data.id);

      this.table.dataSource.data = this.gateway.modules.filter(m => !m.isMaster);
      this.table.dataSource.sort = this.sort;
    });
  }



  deleteModule(row: GatewayManagementData) {
    if (row.id) {
      this.store.system.deleteGatewayModule(this.gateway.id, row.id);
      this.table.dataSource.data = this.table.dataSource.data.filter(data => data.id !== row.id);
      this.notification.success(this.translate('messages.notifications.delete.success'));
    }
  }

  toggleAdvancedOptions() {
    this.collapsed = !this.collapsed;
  }

  onDelete() {
    this.dialog.open(DeleteGatewayModalComponent, {
      panelClass: 'dialog-width-25',
      data: { gateway: this.data.id }
    }).afterClosed().pipe(take(1)).subscribe(
      evt => {
        if (evt?.deleted) {
          this.onClose();
        }
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }

}
