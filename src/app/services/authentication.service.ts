import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { authResponseDTO } from '../api/Models/auth/authDTOs';
import { AuthService } from '../api/services/auth.service';

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
    return this.authData?.Username ?? '';
  }

  constructor(private authSvc: AuthService, private router: Router) {}

  public initialize(): void {
    const authData = this.authData;
    if (authData == undefined) return;
    this.tokenExpiration = authData.TokenExpiration;
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
    return this.tokenExpiration - 60 * 1000 > new Date().valueOf();
  }

  public onLoggedIn(response: authResponseDTO): void {
    this.authData = response;
    this.initialize();
    this.router.navigate(['/passwords']);
  }

  public async refreshToken(): Promise<void> {
    if (this.authData == undefined) return;
    const authData = await this.authSvc.refreshToken({
      RefreshToken: this.authData.RefreshToken,
    });
    console.log('refreshing token');
    this.authData = authData;
    this.initialize();
  }

  logout() {
    console.log('logging out');
    this.authData = undefined;
    clearInterval(this.tokenCheckerInterval);
    this.router.navigate(['/']);
  }
}
