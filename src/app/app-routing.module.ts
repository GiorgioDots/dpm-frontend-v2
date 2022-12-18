import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/auth/home/home.component';
import { PasswordResetComponent } from './pages/auth/password-reset/password-reset.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { GdprComponent } from './pages/gdpr/gdpr.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PasswordsComponent } from './pages/passwords/passwords.component';

const routes: Routes = [
  { path: 'gdpr', component: GdprComponent },
  {
    path: 'passwords',
    component: PasswordsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'signup', component: SignupComponent, canActivate: [NotAuthGuard] },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent,
    canActivate: [NotAuthGuard],
  },
  { path: '', component: HomeComponent, canActivate: [NotAuthGuard] },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
