import { Component, Input, OnInit, DoCheck, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

import { MatCheckboxChange } from '@angular/material/checkbox';

import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'catalog-forms-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }]
})
export class CheckboxComponent implements ControlValueAccessor, OnInit, DoCheck, OnDestroy {

  @Input() formControlField: FormControl;
  @Input() label: string;
  @Input() hideMessages: boolean;

  public hasError: boolean;
  public errorMessage: string;

  public value: boolean;
  public checked: boolean;

  private onChange: any = () => { };
  private onTouch: any = () => { };

  constructor(
    private formsService: FormsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.label = this.label || '';
    this.hideMessages = this.hideMessages || false;
  }

  ngDoCheck() {

    this.hasError = (this.formControlField.invalid && (this.formControlField.touched || this.formControlField.dirty));
    this.errorMessage = this.hasError ? this.formsService.getValidationMessage(this.formControlField.errors) : '';
    this.cdr.detectChanges();

  }

  // Below methods are automatically called for each component implementing ControlValueAccessor interface.
  // // Writes new values from the form model into the view.
  writeValue(value: boolean) {
    this.value = value;
    this.checked = value ; // ? 'checked' : null;
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

  onChanged(e: MatCheckboxChange) {
    this.checked = e.checked; //  ? 'checked' : null;
    this.onChange(e.checked);
  }

  ngOnDestroy() { }

}
