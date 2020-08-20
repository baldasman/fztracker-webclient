import { Component, OnInit, Output, ChangeDetectionStrategy, EventEmitter, HostListener, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'main-theme-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit {
  @Input() allowDismiss: boolean;
  @Output() dismissEvent = new EventEmitter();

  @HostListener('window:keyup.esc', ['$event']) onKeyUp(e) {
    if (!e.defaultPrevented) {
      this.dialogRef.close();
    }
  }

  constructor(private dialogRef: MatDialogRef<ModalComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    if (this.allowDismiss === undefined) { this.allowDismiss = true; }
  }

  dismiss() {
    this.dismissEvent.emit();
  }

}
