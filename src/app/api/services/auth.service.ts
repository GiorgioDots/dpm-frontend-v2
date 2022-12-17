import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { authResponseDTO, loginDTO } from '../Models/auth/authDTOs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public async login(login: loginDTO): Promise<authResponseDTO> {
    const request = this.http.post<authResponseDTO>(
      `${environment.baseUrl}/auth/login`,
      login
    );
    return lastValueFrom(request);
  }
}
