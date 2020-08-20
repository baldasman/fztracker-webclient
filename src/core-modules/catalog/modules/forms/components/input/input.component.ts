import { Component, Input, Output, OnInit, AfterViewInit, DoCheck, OnDestroy, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { FormsService } from '../../services/forms.service';

import { v4 as uuid } from 'uuid';

declare var Clipboard: any;

@Component({
  selector: 'catalog-forms-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor, OnInit, AfterViewInit, DoCheck, OnDestroy {
  @ViewChild('prependedContent', { static: true }) prependedContent: ElementRef;
  @ViewChild('appendedContent', { static: true }) appendedContent: ElementRef;

  @Input() formControlField: FormControl;

  @Input() id?: string;
  @Input() type?: string;
  @Input() label: string;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() description: string;

  @Input() autofocus: boolean;
  @Input() readonly: boolean;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() min: number;
  @Input() max: number;

  @Input() tooltip: string;
  @Input() icon: string;

  @Input() hideMessages: boolean;

  @Input() fieldIcon: string;
  @Input() showClearContentAction: boolean;
  @Input() isLoading: boolean;
  @Input() copyToClipboard: boolean;
  @Input() actions: Array<object>;

  @Output() fieldIconClickedEvent = new EventEmitter();
  @Output() actionClickedEvent = new EventEmitter();


  public value: string;
  public hasError: boolean;
  // public errors: object;
  public errorMessage: string;
  public isInputGroup: boolean;

  private clipboard: any;
  public clipboardId: string;

  private onChange: any = () => { };
  private onTouch: any = () => { };

  constructor(
    private t: TranslateService,
    private toastrService: ToastrService,
    private formsService: FormsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.id = this.id || uuid();
    this.tooltip = this.tooltip || '';
    this.placeholder = this.placeholder || '';
    this.type = this.type || 'text';
    this.clipboardId = this.id + '-cb';
    this.hideMessages = this.hideMessages || false;
    this.label = this.label || '';
    this.isLoading = this.isLoading !== undefined ? this.isLoading : false;

    if (this.copyToClipboard || this.actions || this.prependedContent.nativeElement.childNodes.length !== 0 || this.appendedContent.nativeElement.childNodes.length !== 0) {
      this.isInputGroup = true;
    }
  }

  ngAfterViewInit() {
    if (this.copyToClipboard) {
      // this target is needed because it doesn't accept dynamic ids in the view and is the Clipboard's method of assigning a target with a dynamic id
      this.clipboard = new Clipboard(`#${this.clipboardId}`, {
        target: () => {
          return document.getElementById(this.id);
        },
      });

      this.clipboard.on('success', (e) => { e.clearSelection(), this.throwCopiedNotification(); });
    }
  }

  ngDoCheck() {

    this.hasError = (this.formControlField.invalid && (this.formControlField.touched || this.formControlField.dirty));
    this.errorMessage = this.hasError ? this.formsService.getValidationMessage(this.formControlField.errors) : '';
    this.cdr.detectChanges();

    // TODO: remove this if all goes well!
    // if (this.hasError !== (this.formControlField.invalid && (this.formControlField.touched || this.formControlField.dirty))) {
    //   this.hasError = (this.formControlField.invalid && (this.formControlField.touched && this.formControlField.dirty));
    //   this.errors = this.formControlField.errors;
    //   this.errorMessage = this.formsService.getValidationMessage(this.formControlField.errors);
    //   this.cdr.detectChanges();
    // }

  }

  // Below methods are automatically called for each component implementing ControlValueAccessor interface.
  // // Writes new values from the form model into the view.
  writeValue(value: string) {
    this.value = value ? value.toString().trim() : null;
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
    this.onChange(e.target.value.trim());
    this.value = e.target.value.trim();
  }

  fieldIconClicked(e) {
    this.fieldIconClickedEvent.emit({
      event: e,
    });
  }


  onShowClearContentActionClicked() {
    this.onChanged({ target: { value: '' } });
   }

  throwCopiedNotification() {
    this.toastrService.success(this.t.instant('actions.copied_to_clipboard'));
  }

  onActionClicked(action) {
    this.actionClickedEvent.emit({ action });
  }

  togglePasswordVisibility(show: boolean) {
    this.type = show ? 'text' : 'password';
  }

  ngOnDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  }

}
