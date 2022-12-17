import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { HomeComponent } from './pages/auth/home/home.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { GdprComponent } from './pages/gdpr/gdpr.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ErrorCatchingInterceptor } from './interceptors/error-catching.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    ForgotPasswordComponent,
    GdprComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    ClipboardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
