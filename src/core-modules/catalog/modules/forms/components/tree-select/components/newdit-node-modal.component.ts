import { Component, OnDestroy, OnInit, Inject, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormsService } from '../../../services/forms.service';

export interface Data {
  id?: string;
  name?: string;
}


@Component({
  selector: 'app-newdit-node-modal.component',
  templateUrl: './newdit-node-modal.component.html',
  styleUrls: ['./newdit-node-modal.component.scss']
})
export class NewditNodeModalComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public title: string;

  get f() { return this.form.controls; }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Data,
    public dialogRef: MatDialogRef<NewditNodeModalComponent>,
    private formBuilder: FormBuilder,
    private formsService: FormsService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.data.name || null, Validators.required]
    });

    this.title = this.data.id ? 'Edit node' : 'Add node'; // TODO: Translate this!
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    if (!this.form.valid) {
      this.formsService.showErrors(this.form);
      return;
    }

    this.dialogRef.close({ data: this.form.value });
  }

  ngOnDestroy() { }
}
