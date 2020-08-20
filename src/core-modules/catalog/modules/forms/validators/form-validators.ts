import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


export function hexadecimalFormatValidator(control: AbstractControl): ValidationErrors | null {

  if (!control.value) { return null; }

  const regex = /^(0x)?[0-9a-f]+$/i;
  return regex.test(control.value) ? null : { hexadecimalFormat: true };

}

export function minHexadecimalValidator(minValue: string | number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) { return null; }
    return parseInt(control.value, 16) >= parseInt(minValue as string, 16) ? null : { minHexadecimal: { min: minValue } };
  };
}

export function maxHexadecimalValidator(maxValue: string | number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) { return null; }
    return parseInt(control.value, 16) <= parseInt(maxValue as string, 16) ? null : { maxHexadecimal: { max: maxValue } };
  };
}

export function passwordFormatValidator(control: AbstractControl): ValidationErrors | null {
  const regex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
  return regex.test(control.value) ? { passwordFormat: true } : null;
}

export function passwordFieldsMatchValidator(formGroup: FormGroup): ValidationErrors | null {
  return formGroup.controls.password.value === formGroup.controls.confirmPassword.value ? null : { passwordFieldsMatch: true };
}

export function jsonFormatValidator(control: AbstractControl): ValidationErrors | null {
  try {
    JSON.parse(control.value);
    return null;
  }
  catch (error) {
    return { jsonFormat: true };
  }
}
