import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/auth/home/home.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { GdprComponent } from './pages/gdpr/gdpr.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'gdpr', component: GdprComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
