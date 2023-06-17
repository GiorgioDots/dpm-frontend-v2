import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { loginDTO } from 'src/app/api/Models/auth/authDTOs';
import { AuthService } from 'src/app/api/services/auth.service';
import { regexValidator } from 'src/app/custom-validators/custom-validators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  get loginControlInvalid(): boolean {
    let control = this.loginFormGroup.get('login');
    if (control != null) {
      return control.touched && control.dirty && control.invalid;
    }
    return false;
  }

  get passwordControlInvalid(): boolean {
    let control = this.loginFormGroup.get('password');
    if (control != null) {
      return control.touched && control.dirty && control.invalid;
    }
    return false;
  }

  public loginFormGroup: FormGroup = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      regexValidator(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.$!%*?&])[A-Za-z\d@.$!%*?&]{8,}$/
      ),
    ]),
  });

  constructor(
    private authSvc: AuthService,
    private msgSvc: MessagesService,
    private router: Router,
    private authenticationSvc: AuthenticationService
  ) {
    let state = this.router.getCurrentNavigation()?.extras?.state as
      | loginDTO
      | undefined;
    if (state == undefined) {
      return;
    }
    this.loginFormGroup.setValue(state);
  }

  ngOnInit() {}

  public async login() {
    if (this.loginFormGroup.invalid) {
      return;
    }
    let loginValues = this.loginFormGroup.getRawValue() as loginDTO;
    const response = await this.authSvc.login(loginValues);
    this.msgSvc.pushSuccessMessage(response.message);
    this.authenticationSvc.onLoggedIn(response);
  }
}
