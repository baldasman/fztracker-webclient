import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ChangeDetectorRef, DoCheck, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl, ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuid } from 'uuid';

import { FormsService } from '../../services/forms.service';

declare var Clipboard: any;

@Component({
  selector: 'app-form-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TextAreaComponent, multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextAreaComponent implements ControlValueAccessor, OnInit, AfterViewInit, DoCheck, OnDestroy {
  @Input() formControlField: FormControl;

  @Input() id?: string;
  @Input() label?: string;
  @Input() placeholder: string;
  @Input() defaultValue: string;
  @Input() required: boolean;
  @Input() description: boolean;

  @Input() autofocus: boolean;
  @Input() readonly: boolean;
  @Input() resizable: boolean;
  @Input() rows: number;

  @Input() icon: string;
  @Input() tooltip: string;

  @Input() hideMessages: boolean;

  @Input() copyToClipboard: boolean;

  @Output() changeValueEvent = new EventEmitter();

  public value: string;
  public hasError: boolean;
  public errors: object;
  public errorMessage: string;

  private clipboard: any;
  public clipboardId: string;

  private onChange: any = () => { };
  private onTouch: any = () => { };

  constructor(
    private cdr: ChangeDetectorRef,
    private t: TranslateService,
    private formsService: FormsService
  ) { }

  ngOnInit() {
    this.id = (this.id || uuid()) + '-in';
    this.rows = (this.rows || 5);
    this.tooltip = (this.tooltip || '');
    this.placeholder = (this.placeholder || '');
    this.clipboardId = this.id + '-cb';
    this.hideMessages = this.hideMessages || false;
  }

  ngAfterViewInit() {
    if (this.copyToClipboard) {
      // this target is needed because it doesn't accept dynamic ids in the view and is the Clipboard's method of assigning a target with a dynamic id
      this.clipboard = new Clipboard(`#${this.clipboardId}`, {
        target: () => {
          return $(`#${this.id}`).get(0);
        },
      });

      this.clipboard.on('success', (e) => { e.clearSelection(), this.throwCopiedNotification(); });
    }
  }

  ngDoCheck() {

    if (this.hasError !== (this.formControlField.invalid && this.formControlField.touched && this.formControlField.dirty)) {
      this.hasError = (this.formControlField.invalid && (this.formControlField.touched && this.formControlField.dirty));
      this.cdr.detectChanges();
    }

    if (this.errors !== this.formControlField.errors) {
      this.errors = this.formControlField.errors;
      this.errorMessage = this.formsService.getValidationMessage(this.formControlField.errors);
      this.cdr.detectChanges();
    }

  }

  // Below methods are automatically called for each component implementing ControlValueAccessor interface.
  // // Writes new values from the form model into the view.
  writeValue(value: string) {
    this.value = value;
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
    this.onChange(e.target.value);
  }

  throwCopiedNotification() {
    const options = { timeout: 5000, message: this.t.instant('actions.copied_to_clipboard'), type: 'success' };
  }

  ngOnDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  }
}
