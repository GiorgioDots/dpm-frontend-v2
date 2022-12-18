import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function regexValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const notValid = !nameRe.test(control.value);
    return notValid ? { passwordNotValid: { value: control.value } } : null;
  };
}
