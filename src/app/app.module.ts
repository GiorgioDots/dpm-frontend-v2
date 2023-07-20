import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { HomeComponent } from './pages/auth/home/home.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { GdprComponent } from './pages/gdpr/gdpr.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ErrorCatchingInterceptor } from './interceptors/error-catching.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { LoadingComponent } from './components/loading/loading.component';
import { PasswordResetComponent } from './pages/auth/password-reset/password-reset.component';
import { from, Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { AuthService } from './api/services/auth.service';
import { PasswordsComponent } from './pages/passwords/passwords.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { environment } from 'src/environments/environment';
import { PasswordEditComponent } from './pages/passwords/password-edit/password-edit.component';
import { ModalComponent } from './components/modal/modal.component';
import { SettingsComponent } from './pages/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    ForgotPasswordComponent,
    GdprComponent,
    PageNotFoundComponent,
    LoadingComponent,
    PasswordResetComponent,
    PasswordsComponent,
    PasswordEditComponent,
    ModalComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    ClipboardModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: !environment.production,
    //   // Register the ServiceWorker as soon as the application is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000',
    // }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthenticationService, AuthService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

function initializeAppFactory(
  authenticationSvc: AuthenticationService,
  authSvc: AuthService
): () => Observable<any> {
  return () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        debugger;
        authenticationSvc.initialize();
        if (authenticationSvc.authData == undefined) {
          return resolve('not authenticated');
        }
        if (authenticationSvc.isAuthenticated()) {
          return resolve('ok');
        }
        // token expired
        await authenticationSvc.refreshToken();
        resolve('ok');
      } catch (error) {
        resolve('error');
      }
    });
    return from(promise);
  };
}
