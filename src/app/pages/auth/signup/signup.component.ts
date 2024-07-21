import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { finalize } from 'rxjs';
import { loginDTO, signupDTO } from '../../../api/models/auth/authDTO';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../../api/services/auth.service';
import { MessageAdapterService } from '../../../shared/services/message-adapter.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    RouterModule,
    CheckboxModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  pswRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*[@.$!%*?&])/;
  strongRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*[@.$!%*?&])';

  constructor(public authSvc: AuthService, private msgSvc: MessageAdapterService, private router: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.pswRegex),
      ]),
      gdprAgree: new FormControl(false, [Validators.requiredTrue]),
    });
  }
  
  onSignup() {
    if (this.signupForm.invalid) return;
    let signupValues = this.signupForm.getRawValue() as signupDTO;
    this.signupForm.disable();
    this.authSvc
      .signUp(signupValues)
      .pipe(
        finalize(() => {
          this.signupForm.enable();
        })
      )
      .subscribe(res => {
        this.msgSvc.addSuccess(res.message);
        let loginValues: loginDTO = {
          login: signupValues.username,
          password: signupValues.password,
        };
        this.router.navigate(['/auth', 'login'], { state: loginValues });
      });
  }
  // public async signup() {
  //   if (this.signupFormGroup.invalid) {
  //     return;
  //   }
  //   let signupValues = this.signupFormGroup.getRawValue() as signupDTO;

  //   const response = await this.authSvc.signUp(signupValues);

  //   this.msgSvc.pushSuccessMessage(response.message);

  //   let loginValues: loginDTO = {
  //     login: signupValues.username,
  //     password: signupValues.password,
  //   };
  //   this.router.navigate(['/'], { state: loginValues });
  // }
}
