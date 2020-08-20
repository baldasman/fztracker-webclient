import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-node-modal.component',
  templateUrl: './delete-node-modal.component.html'
})
export class DeleteNodeModalComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<DeleteNodeModalComponent>
  ) { }

  ngOnInit() {}

  onClose() {
    this.dialogRef.close({ data: { deleted: false } });
  }

  onDelete() {
    this.dialogRef.close({ data: { deleted: true } });
  }

  ngOnDestroy() { }
}
