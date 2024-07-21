import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { authResponseDTO, loginDTO } from '../../api/models/auth/authDTO';
import { AuthService } from '../../api/services/auth.service';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenExpiration: number | undefined;
  private tokenCheckerInterval: ReturnType<typeof setInterval> | undefined;

  private _authData: authResponseDTO | undefined;
  public get authData(): authResponseDTO | undefined {
    if (this._authData == undefined) {
      const serializedData = localStorage.getItem('auth');
      if (serializedData == null) return undefined;
      const data = JSON.parse(serializedData) as authResponseDTO;
      this._authData = data;
    }
    return this._authData;
  }

  public set authData(value: authResponseDTO | undefined) {
    if (value == undefined) {
      localStorage.removeItem('auth');
      this._authData = undefined;
    } else {
      localStorage.setItem('auth', JSON.stringify(value));
      this._authData = value;
    }
  }

  public get username(): string {
    return this.authData?.username ?? '';
  }

  constructor(private authSvc: AuthService, private router: Router) {}

  public initialize(): void {
    const authData = this.authData;
    if (authData == undefined) return;
    this.tokenExpiration = this.getTokenExpiration(authData.token);
    this.tokenCheckerInterval = setInterval(async () => {
      if (this.isAuthenticated()) return;

      // refreshing token
      clearInterval(this.tokenCheckerInterval);
      await this.refreshToken();
    }, 1000);
  }

  public isAuthenticated(): boolean {
    if (this.authData == undefined) return false;
    if (this.tokenExpiration == undefined) return false;
    return (
      (this.tokenExpiration - 10) * 1000 > Math.floor(new Date().getTime())
    );
  }

  public onLoggedIn(response: authResponseDTO): void {
    this.authData = response;
    this.initialize();
    this.router.navigate(['']);
  }

  public login(login: loginDTO) {
    return this.authSvc.login(login).pipe(
      tap((data) => {
        this.onLoggedIn(data);
      })
    );
  }

  public refreshToken() {
    if (this.authData == undefined) return of(() => "no-refresh");
    return this.authSvc
      .refreshToken({
        refreshToken: this.authData.refreshToken,
      })
      .pipe(
        tap((res: authResponseDTO) => {
          this.authData = res;
          this.initialize();
          // this.router.navigate(['']);
          return res;
        }),
        catchError((err) => {
          // this.logout();
          return err;
        })
      );
  }

  logout() {
    this.authData = undefined;
    clearInterval(this.tokenCheckerInterval);
    sessionStorage.clear();
    this.router.navigate(['auth', 'login']);
  }

  private getTokenExpiration(token: string) {
    const expiry = JSON.parse(atob(token.split('.')[1]).toString()).exp;
    return expiry;
  }
}
