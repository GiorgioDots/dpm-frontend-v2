import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { loginDTO } from '../../../api/models/auth/authDTO';
import { catchError, finalize, throwError } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(public authSvc: AuthenticationService, private router: Router) {
    let state = this.router.getCurrentNavigation()?.extras?.state as
      | loginDTO
      | undefined;
    this.loginForm = new FormGroup({
      login: new FormControl(state?.login ?? '', [Validators.required]),
      password: new FormControl(state?.password ?? '', [Validators.required]),
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    let loginValues = this.loginForm.getRawValue() as loginDTO;
    this.loginForm.disable();
    this.authSvc
      .login(loginValues)
      .pipe(
        catchError((e) => {
          this.loginForm.enable();
          return throwError(() => e)
        })
      )
      .subscribe();
  }
}
