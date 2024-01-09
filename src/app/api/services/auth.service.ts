import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  authResponseDTO,
  loginDTO,
  refreshTokenDTO,
  signupDTO,
} from '../Models/auth/authDTOs';
import { messageDTO } from '../Models/messageDTO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public async login(login: loginDTO): Promise<authResponseDTO> {
    return this.http
      .post<authResponseDTO>(`${environment.baseUrl}/auth/login`, login)
      .toPromise();
  }

  public async signUp(signupValues: signupDTO): Promise<messageDTO> {
    return this.http
      .post<authResponseDTO>(
        `${environment.baseUrl}/auth/signup`,
        signupValues
      )
      .toPromise();
  }

  public async refreshToken(value: refreshTokenDTO): Promise<authResponseDTO> {
    return this.http
      .post<authResponseDTO>(
        `${environment.baseUrl}/auth/refresh-token`,
        value,
        {
          headers: new HttpHeaders({
            SILENT_CALL: 'true',
          }),
        }
      )
      .toPromise();
  }
  public async deleteAccount(): Promise<messageDTO> {
    return this.http
      .delete<messageDTO>(`${environment.baseUrl}/auth/delete-account`)
      .toPromise();
  }
}
