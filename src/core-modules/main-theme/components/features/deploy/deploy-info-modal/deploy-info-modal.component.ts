import { Component, OnInit, Inject } from '@angular/core';

import { Mixin, Core, Stores } from '@app/base';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-home-modals-deploy-info-modal',
  templateUrl: './deploy-info-modal.component.html'
})
export class DeployInfoModalComponent extends Mixin(Core, Stores) implements OnInit {
  public userName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      gatewayName: string;
      deploy: string;
      stageParcial: number; // TODO remove this when endpoint is complete
    },
    public dialogRef: MatDialogRef<DeployInfoModalComponent>
  ) {
    super();
  }

  ngOnInit() { }

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }


}
