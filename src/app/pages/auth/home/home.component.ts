import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { loginDTO } from 'src/app/api/Models/auth/authDTOs';
import { AuthService } from 'src/app/api/services/auth.service';
import { authPasswordValidator } from 'src/app/custom-validators/custom-validators';
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
    login: new FormControl('giodots', [Validators.required]),
    password: new FormControl('Pokerface96.', [
      Validators.required,
      authPasswordValidator(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.$!%*?&])[A-Za-z\d@.$!%*?&]{8,}$/
      ),
    ]),
  });

  constructor(private authSvc: AuthService, private msgSvc: MessagesService) {}

  ngOnInit(): void {}

  public async login() {
    console.log(this.loginFormGroup.invalid);
    if (this.loginFormGroup.invalid) {
      return;
    }
    let loginValues = this.loginFormGroup.getRawValue() as loginDTO;
    const response = await this.authSvc.login(loginValues);
    this.msgSvc.pushSuccessMessage(response.Message);
  }
}
