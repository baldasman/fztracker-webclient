import { Injectable } from '@angular/core';
import { FormGroup, FormArray, AbstractControl} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { isEmpty } from 'lodash';

@Injectable()
export class FormsService {

  constructor(
    private t: TranslateService
  ) {}

  getValidationMessage(error: object) {
    if (isEmpty(error)) {
      return null;
    }

    if ('custom' in error)              { return error['custom']; }
    if ('required' in error)            { return this.t.instant('dictionary.required'); }
    if ('email' in error)               { return this.t.instant('messages.errors.invalid_email'); }
    if ('wrongVersionNumber' in error)  { return this.t.instant('messages.errors.invalid_version_number'); }
    if ('wrongVersionPattern' in error) { return this.t.instant('messages.errors.invalid_version_pattern'); }
    if ('passwordFormat' in error)      { return this.t.instant('messages.errors.password_regex'); }
    if ('passwordFieldsMatch' in error) { return this.t.instant('messages.errors.password_mismatch'); }
    if ('pattern' in error)             { return this.t.instant('messages.errors.invalid_format'); }
    if ('jsonFormat' in error)          { return this.t.instant('messages.errors.json_format'); }
    if ('sameDisplayName' in error)     { return this.t.instant('messages.errors.unique_property_name'); }
    if ('minlength' in error)           { return this.t.instant('messages.errors.min_length') + ' (' + error['minlength']['requiredLength'] + ')'; }
    if ('min' in error)                 { return this.t.instant('messages.errors.invalid_value'); }
    if ('rangeError' in error)          { return this.t.instant('messages.errors.invalid_value'); }
  }


  showErrors(form: FormGroup | FormArray) {

    Object.keys(form.controls).forEach((key: string) => {
      const abstractControl = form.controls[key] as AbstractControl;

      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        this.showErrors(abstractControl);
      } else {
        abstractControl.markAsDirty();
        abstractControl.markAsTouched();
      }
    });

  }

// TODO: Legacy code to be removed in due time.
/*
  initFormErrors(form) {
    // subscribe changes to each control and validate error messages
    Object.keys(form.controls).forEach(control => {
      // on create
      form.controls[control] = this.getFormErrorMessages(form.controls[control]);
      form.get(control).valueChanges.subscribe(() => {
        // after create update errors
        form.controls[control] = this.getFormErrorMessages(form.controls[control]);
      });
    });

    return form;
  }

  getFormErrorMessages(control, errors?) {
      Object.keys(control.errors || {}).forEach(error => {
        control.errorMessages = control.errorMessages || {};
        control.errorMessages[error] = {};

        if (((errors || {})[control] || {})[error]) {
          // custom message
          control.errorMessages[error] = errors[control][error];
        } else {
          switch (error) {
            case 'required':
              control.errorMessages[error] = this.t.instant('dictionary.required');
              break;
            case 'email':
              control.errorMessages[error] = this.t.instant('messages.errors.invalid_email');
              break;
            case 'wrongVersionNumber':
              control.errorMessages[error] = this.t.instant('messages.errors.invalid_version_number');
              break;
            case 'wrongVersionPattern':
              control.errorMessages[error] = this.t.instant('messages.errors.invalid_version_pattern');
              break;
            case 'password':
              control.errorMessages[error] = this.t.instant('messages.errors.password_regex');
              break;
            case 'pattern':
              control.errorMessages[error] = 'TO BE CREATED';
              break;
            case 'sameDisplayName':
              control.errorMessages[error] = this.t.instant('messages.errors.unique_property_name');
              break;
            case 'minlength':
              control.errorMessages[error] = this.t.instant('messages.errors.min_length');
              break;
            default:
              control.errorMessages[error] = this.t.instant('messages.errors.something_went_wrong');
              break;
          }
        }
      });

    return control;
  }

  getErrorMessages(apiResponse) {
    if (apiResponse.error.data.errors) {
      return apiResponse.error.data.errors.map(error => {
        return { field: Object.keys(error)[0], message: Object.values(error)[0] };
      });
    }
    return [{ field: 'base', message: apiResponse.error.resultMessage }];
  }

  */

}
