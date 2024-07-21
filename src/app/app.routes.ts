import { Routes } from '@angular/router';
import notAuthGuard from './shared/guards/not-auth.guard';
import authGuard from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'passwords', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((k) => k.HomeComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'passwords',
        loadComponent: () =>
          import('./pages/home/passwords/passwords.component').then(
            (k) => k.PasswordsComponent
          ),
      },
      {
        path: 'passwords/:id',
        loadComponent: () =>
          import('./pages/home/passwords/password/password.component').then(
            (k) => k.PasswordComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/home/settings/settings.component').then(
            (k) => k.SettingsComponent
          ),
      },
    ],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [notAuthGuard],
    loadComponent: () =>
      import('./pages/auth/auth.component').then((k) => k.AuthComponent),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then(
            (k) => k.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./pages/auth/signup/signup.component').then(
            (k) => k.SignupComponent
          ),
      },
    ],
  },
];
