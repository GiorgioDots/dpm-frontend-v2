import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  authResponseDTO,
  loginDTO,
  refreshTokenDTO,
  signupDTO,
} from '../models/auth/authDTO';
import { messageDTO } from '../models/messageDTO';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get baseUrl() {
    if (environment.baseUrl.includes('localhost')) {
      return environment.baseUrl + ':3000/dev';
    }
    return environment.baseUrl;
  }
  constructor(private http: HttpClient) {}

  public login(login: loginDTO) {
    return this.http.post<authResponseDTO>(`${this.baseUrl}/auth/login`, login);
  }

  public signUp(signupValues: signupDTO) {
    return this.http.post<authResponseDTO>(
      `${this.baseUrl}/auth/signup`,
      signupValues
    );
  }

  public refreshToken(value: refreshTokenDTO) {
    return this.http.post<authResponseDTO>(
      `${this.baseUrl}/auth/refresh-token`,
      value
    );
  }
  public deleteAccount() {
    return this.http.delete<messageDTO>(`${this.baseUrl}/auth/delete-account`);
  }
}
