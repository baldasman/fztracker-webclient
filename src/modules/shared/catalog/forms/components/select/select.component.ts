import { Component, Input, OnInit, AfterViewInit, DoCheck, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

import { FormsService } from '../../services/forms.service';

import { v4 as uuid } from 'uuid';
import { upperFirst } from 'lodash';

@Component({
  selector: 'app-form-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None, // Atention! Styles used here are applied to all DOM!
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }]
})

export class SelectComponent implements ControlValueAccessor, OnInit, AfterViewInit, DoCheck, OnDestroy {

  @Input() formControlField: FormControl;

  @Input() id?: string;
  @Input() label: string;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() description: string;
  @Input() appendTo: string;
  @Input() groupBy: string;

  @Input() items: object;
  @Input() multiple: boolean;

  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() clearable?: boolean;

  @Input() hideMessages: boolean;

  public selectedValue: string;
  public hasError: boolean;
  public errors: object;
  public errorMessage: string;

  private onChange: any = () => {};
  private onTouch: any = () => {};

  constructor(
    private cdr: ChangeDetectorRef,
    private formsService: FormsService
  ) {}

  ngOnInit() {
    this.id           = this.id || uuid();
    this.bindLabel    = this.bindLabel || 'value';
    this.bindValue    = this.bindValue || 'id';
    this.clearable    = !!this.clearable;
    this.hideMessages = this.hideMessages || false;
    this.label        = upperFirst(this.label) || '';
    this.placeholder  = this.placeholder || '';
  }

  ngAfterViewInit() {}

  ngDoCheck() {

    if (this.hasError !== (this.formControlField.invalid && this.formControlField.touched && this.formControlField.dirty)) {
      this.hasError = (this.formControlField.invalid && (this.formControlField.touched && this.formControlField.dirty));
      this.cdr.detectChanges();
    }

    if (this.errors !== this.formControlField.errors) {
      this.errors = this.formControlField.errors;
      this.errorMessage = upperFirst(this.formsService.getValidationMessage(this.formControlField.errors));
      this.cdr.detectChanges();
    }

  }

  // Below methods are automatically called for each component implementing ControlValueAccessor interface.
  // // Writes new values from the form model into the view.
  writeValue(value: any) {
    this.selectedValue = value;
    this.cdr.detectChanges();
  }

  // // Used to register a handler that should be fired when something in the view change.
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // // Similar to registerOnChange(), but this registers a handler specifically for when a control receives a touch event.
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  onTouched() {
    this.onTouch(null);
  }

  onChanged(e: any) {
    let value: any = null;

    if (e) {
      if (!this.multiple) {
        value = e[this.bindValue];
      } else {
        value = e.map((a: any) => a[this.bindValue]);
      }
    }

    this.onChange(value);
  }

  ngOnDestroy() {}

}
