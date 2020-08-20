import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Mixin, Core, Stores } from '@app/base';
import { CONSTANTS } from '@app/config';

@Component({
  selector: 'app-main-theme-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss']
})
export class AboutModalComponent extends Mixin(Core, Stores) implements OnInit {
  version: string;
  buildNumber: string;
  tenantImageUrl: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public dialogRef: MatDialogRef<AboutModalComponent>
  ) {
    super();
  }

  ngOnInit() {
    this.version = CONSTANTS.version;
    this.buildNumber = CONSTANTS.buildNumber;
    this.tenantImageUrl = 'assets/images/logos/default-logo.png';
  }

  onClose() {
    this.dialogRef.close(false);
  }

}
