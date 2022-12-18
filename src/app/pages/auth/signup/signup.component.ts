import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { loginDTO, signupDTO } from 'src/app/api/Models/auth/authDTOs';
import { AuthService } from 'src/app/api/services/auth.service';
import { regexValidator } from 'src/app/custom-validators/custom-validators';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  get usernameControlInvalid(): boolean {
    let control = this.loginFormGroup.get('username');
    return this.controlInvalid(control);
  }

  get passwordControlInvalid(): boolean {
    let control = this.loginFormGroup.get('password');
    return this.controlInvalid(control);
  }

  get emailControlInvalid(): boolean {
    let control = this.loginFormGroup.get('email');
    return this.controlInvalid(control);
  }

  get gdprControlInvalid(): boolean {
    let control = this.loginFormGroup.get('gdprAgree');
    return this.controlInvalid(control);
  }

  public loginFormGroup: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      regexValidator(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.$!%*?&])[A-Za-z\d@.$!%*?&]{8,}$/
      ),
    ]),
    gdprAgree: new FormControl(false, [Validators.requiredTrue]),
  });

  constructor(
    private authSvc: AuthService,
    private msgSvc: MessagesService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  public controlInvalid(control: AbstractControl | null): boolean {
    if (control != null) {
      return control.touched && control.dirty && control.invalid;
    }
    return true;
  }

  public async signup() {
    console.log(this.loginFormGroup.invalid);
    if (this.loginFormGroup.invalid) {
      return;
    }
    let signupValues = this.loginFormGroup.getRawValue() as signupDTO;

    const response = await this.authSvc.signUp(signupValues);
    
    this.msgSvc.pushSuccessMessage(response.Message);
    
    let loginValues: loginDTO = {
      login: signupValues.username,
      password: signupValues.password,
    };
    this.router.navigate(['/'], { state: loginValues });
  }
}
