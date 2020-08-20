import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { sortBy } from 'lodash';

import { ParameterModel, ParameterValueModel, ParameterValueDetailedModel, DefaultDataModel } from '../models/form-engine.models';

import { hexadecimalFormatValidator, minHexadecimalValidator, maxHexadecimalValidator } from '../../../validators/form-validators';

export class FormEngineHelper {

  // Parameters helper methods.
  static isAnyVisibleField(parameters: ParameterModel[]): boolean {
    return parameters.some(parameter => parameter.isVisible );
  }


  // Form helper methods.
  static buildForm(parameters: ParameterModel[], values: DefaultDataModel): FormGroup {

    const form = new FormGroup({});

    // Build form structure.
    parameters = sortBy(parameters, ['rank', 'label']);
    parameters.forEach(parameter => {

      switch (parameter.dataType) {
        case 'fields-group':
          form.addControl(parameter.key, new FormArray([]));
          break;
        default:
          form.addControl(parameter.key, FormEngineHelper.createParameterFormControl(parameter));
          if (this.isParameterVisible(form, parameter)) {
            form.get(parameter.key).setValidators(FormEngineHelper.getParameterValidators(parameter));
            form.get(parameter.key).updateValueAndValidity();
          }
          break;
      }

    });

    // Set values into previous built form.
    Object.keys(values).forEach((parameterKey) => {

      if (form.get(parameterKey)) {

        const parameterValue = values[parameterKey] as ParameterValueModel;
        switch (parameterValue.dataType) {

          case 'array': // If array, creates an FormArray with a FormGrop to each line of fields.
            const parameter = parameters.find(p => p.key === parameterKey);
            (parameterValue.value as Array<ParameterValueModel>).forEach((arrayPosition, i) => {
              (form.get(parameter.key) as FormArray).push(FormEngineHelper.addFieldGroupRow(parameter, arrayPosition.value));
            });
            break;

          default:
            form.get(parameterKey).setValue(parameterValue.value);
            break;
        }

      }

    });

    return form;

  }


  static createParameterFormControl(parameter: ParameterModel, value?: any) {

    return new FormControl({ value: (!value && value !== 0 ? null : value), disabled: !parameter.isEditable });

  }


  static getParameterValidators(parameter: ParameterModel) {

    const validators = [];

    if (parameter.validations?.isRequired) { validators.push(Validators.required); }
    if (parameter.validations?.regexPattern) { validators.push(Validators.pattern(parameter.validations.regexPattern)); }
    if (parameter.validations?.minLength) { validators.push(Validators.minLength(parameter.validations.minLength as number)); }
    if (parameter.validations?.maxLength) { validators.push(Validators.maxLength(parameter.validations.maxLength as number)); }

    if (parameter.dataType === 'hexadecimal') {
      validators.push(hexadecimalFormatValidator);
      if (parameter.validations?.min) { validators.push(minHexadecimalValidator(parameter.validations.min)); }
      if (parameter.validations?.max) { validators.push(maxHexadecimalValidator(parameter.validations.max)); }
    }
    else {
      if (parameter.validations?.min) { validators.push(Validators.min(parameter.validations.min as number)); }
      if (parameter.validations?.max) { validators.push(Validators.max(parameter.validations.max as number)); }
    }

    return validators;

  }


  static isParameterVisible(form: FormGroup, parameter: ParameterModel): boolean {

    if (!parameter.isVisible) {
      return false;
    }

    if (parameter.visibilityConditions) {
      // This was the old algorythm, that also checked on fields-group dataType. Does this make sense? Keeping commented for now!
      // const visibilityParameter = this.parameters.find(p =>
      //   p.key === parameter.visibilityConditions.parameter ||
      //   (p.dataType === 'fields-group' && p.fields.find(pAux => pAux.key === parameter.visibilityConditions.parameter) !== undefined)
      // );
      // // check if the parameter found has the value needed to the parameter provided be displayed
      // if (parameter.visibilityConditions.values.find(v => v === this.form.get(visibilityParameter.key).value)) {

      // if value of parameter field is present in "values" array...
      if (parameter.visibilityConditions.values.includes(form.get(parameter.visibilityConditions.parameter)?.value)) {
        return true;
      }
      else {
        return false;
      }
    }

    return true;
  }



  static addFieldGroupRow(parameter: ParameterModel, value?: {}) {

    value = value || {};
    const formGroup = new FormGroup({});

    parameter.fields.forEach(field => {
      const newField = FormEngineHelper.createParameterFormControl(field, (value[field.key]));
      newField.setValidators(FormEngineHelper.getParameterValidators(parameter));
      newField.updateValueAndValidity();

      formGroup.addControl(field.key, newField);
    });

    return formGroup;

  }


  static getFormValues(form: FormGroup, parameters: ParameterModel[]): { valid: boolean, data: DefaultDataModel } {

    const returnForm = { valid: form.valid, data: {} };

    Object.keys(form.getRawValue()).forEach(key => { // getRawValues is needed to return also disabled fields!
      const parameter = parameters.find(p => p.key === key);
      // Condition in TEST (MAY HAVE BUGS!!!): If parameter is not visible (by visibility condition rules), it does not get returned!
      if (parameter && (!parameter.visibilityConditions || (parameter.visibilityConditions && FormEngineHelper.isParameterVisible(form, parameter)))) {
        returnForm.data[key] = new ParameterValueDetailedModel(parameter.dataType, form.getRawValue()[key], FormEngineHelper.isParameterVisible(form, parameter), parameter.rank);
      }
    });

    // this.logger.debug(this.loggerContext + 'getFormValues::getRawValue', this.form.getRawValue());
    // this.logger.debug(this.loggerContext + 'getFormValues::form.data', form.data);
    return returnForm;
  }

}
