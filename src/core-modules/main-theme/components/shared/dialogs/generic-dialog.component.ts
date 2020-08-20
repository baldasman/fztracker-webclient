import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'main-theme-shared-dialogs-generic-dialog',
  templateUrl: './generic-dialog.component.html'
})
export class GenericDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      message: string,
      actions: {
        id: string,
        class: 'btn-cancel' | 'btn-primary' | 'btn-danger' | 'btn-submit',
        label: string,
        icon?: string,
        isPrimaryAction: boolean
      }[],
      allowDismiss?: boolean
    },
    public dialogRef: MatDialogRef<GenericDialogComponent>
  ) { }

  ngOnInit() {
    if (this.data.allowDismiss === undefined) { this.data.allowDismiss = true; }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onAction(action: string) {
    this.dialogRef.close(action);
  }

  keyDownFunction(event) {
    if (this.data.actions && this.data.actions.length > 0) {
      event.preventDefault();
      const primaryAction = this.data.actions.find(a => a.isPrimaryAction === true);

      if (primaryAction) {
        this.onAction(primaryAction.id);
      } else {
        // if dialog doesn't had primary action last button is pressed
        this.onAction(this.data.actions[this.data.actions.length - 1].id);
      }
    }
  }

}
