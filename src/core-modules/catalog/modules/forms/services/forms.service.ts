import { Injectable } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class FormsService {

  constructor(
    private t: TranslateService
  ) { }

  getValidationMessage(error: ValidationErrors) {

    if (!error || Object.keys(error).length === 0) { // if empty!
      return null;
    }

    // Native validations.
    if ('required' in error)            { return this.t.instant('shared.forms_module.validations.required'); }
    if ('email' in error)               { return this.t.instant('shared.forms_module.validations.invalid_email'); }
    if ('min' in error)                 { return this.t.instant('shared.forms_module.validations.min') + ` (${error.min.min})`; }
    if ('max' in error)                 { return this.t.instant('shared.forms_module.validations.max') + ` (${error.max.max})`; }
    if ('minlength' in error)           { return this.t.instant('shared.forms_module.validations.min_length') + ` (${error.minlength.requiredLength})`; }
    if ('maxlength' in error)           { return this.t.instant('shared.forms_module.validations.max_length') + ` (${error.maxlength.requiredLength})`; }
    if ('pattern' in error)             { return this.t.instant('shared.forms_module.validations.invalid_format'); }

    // Custom validators.
    if ('hexadecimalFormat' in error)   { return this.t.instant('shared.forms_module.validations.invalid_hexadecimal_format'); }
    if ('minHexadecimal' in error)      { return this.t.instant('shared.forms_module.validations.min_hexadecimal') + ` (${error.minHexadecimal.min})`; }
    if ('maxHexadecimal' in error)      { return this.t.instant('shared.forms_module.validations.max_hexadecimal') + ` (${error.maxHexadecimal.max})`; }
    if ('passwordFormat' in error)      { return this.t.instant('shared.forms_module.validations.password_regex'); }
    if ('passwordFieldsMatch' in error) { return this.t.instant('shared.forms_module.validations.password_mismatch'); }
    if ('jsonFormat' in error)          { return this.t.instant('shared.forms_module.validations.invalid_json_format'); }

    if ('custom' in error)              { return error.custom; }

  }


  showErrors(form: FormGroup | FormArray) {

    form.markAllAsTouched(); // TODO: Testing this situation!!!

    // Object.keys(form.controls).forEach((key: string) => {
    //   const abstractControl = form.controls[key] as AbstractControl;

    //   if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
    //     this.showErrors(abstractControl);
    //   } else {
    //     abstractControl.markAsDirty();
    //      abstractControl.markAsTouched();
    //   }
    // });

  }


  // Possible future: Method to make generic http calls
  // import { HttpClient } from '@angular/common/http';
  // import { Observable } from 'rxjs';
  // import { UrlModel } from '../models/url.model';
  // class HierachySelectModel {
  //   id: string;
  //   value: string;
  //   path?: string;
  //   children: this[];
  // }
  // httpRequest(method: string, endpoint: string, queryParams?: { [key: string]: string }): Observable<HierachySelectModel> {
  //   const url = new UrlModel(endpoint);
  //   if (queryParams) { url.setQueryParams(queryParams); }
  //   let request: any;
  //   switch (method) {
  //     case 'GET':
  //       request = this.http.get(url.buildUrl()) ;
  //       break;
  //     default:
  //       break;
  //   }
  //   return request;
  // }

}
