import { Component, OnInit, Inject } from '@angular/core';

import { Mixin, Core, Animations, Stores } from '@app/base';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { SystemGatewayModel, SystemService } from '@core-modules/stores';


class SyncModel {
  gateway: SystemGatewayModel;
  system?: { id: string, name: string, gateway: { serialNumber: string, name: string } };
}


@Component({
  selector: 'app-home-modals-synchronize-system-modal',
  templateUrl: './synchronize-system-modal.component.html',
  // animations: [
  //   trigger('fadeIn', [
  //     state('in', style({ 'opacity': '1' })),
  //     state('out', style({ 'opacity': '0' })),
  //     transition('* => *', [
  //       animate(2000)
  //     ])
  //   ])
  // ]

})
export class SynchronizeSystemModalComponent extends Mixin(Core, Animations, Stores) implements OnInit {

  private loggerContext = 'MainTheme::SynchronizeSystemModalComponent';

  // private system: SystemModel;

  visibleContent = {
    fetchingInformation: true,
    syncList: false
  };



  table = {
    displayedColumns: ['system', 'organization'],
    dataSource: new MatTableDataSource([] as SyncModel[])
  };


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public dialogRef: MatDialogRef<SynchronizeSystemModalComponent>,
    private systemService: SystemService
  ) {
    super();
  }


  ngOnInit() {
    this.loader.show('loader');

    this.subscriptions.push(
      this.systemService.getEntitiesInfo().subscribe(response => {
        this.synchronizeLists(this.store.system.getGateways(), response.systems);
        this.visibleContent = { fetchingInformation: false, syncList: true };
      },
        () => {
          this.logger.error(this.loggerContext, 'Error fetching entities list');
        })
    );

  }


  synchronizeLists(list1, list2) {

    const syncList: SyncModel[] = [];

    this.store.system.getGateways().forEach(gateway => {
      syncList.push({ gateway });
    });

    this.table.dataSource.data = syncList;

  }


  onSave() {
    this.dialogRef.close();
  }

  onReset() {
    this.visibleContent = { fetchingInformation: true, syncList: false };
  }

  onCancel() {
    this.dialogRef.close();
  }

}
