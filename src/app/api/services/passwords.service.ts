import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  createPasswordResponseDTO,
  exportPasswordsDTO,
  passwordDTO,
} from '../models/passwords/passwordDTO';
import { messageDTO } from '../models/messageDTO';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  get baseUrl() {
    if (environment.baseUrl.includes('localhost')) {
      return environment.baseUrl + ':3002/dev';
    }
    return environment.baseUrl;
  }

  constructor(private http: HttpClient) {}

  public search(search: string | undefined) {
    return this.http.get<passwordDTO[]>(
      `${this.baseUrl}/passwords/password?search=${search ? search : ''}`
    );
  }

  public getAllPasswords() {
    return this.http.get<passwordDTO[]>(`${this.baseUrl}/passwords`);
  }

  public getPassword(id: string): Observable<passwordDTO> {
    return this.http.get<passwordDTO>(`${this.baseUrl}/passwords/${id}`);
  }

  public updatePassword(id: string, password: passwordDTO) {
    return this.http.put<messageDTO>(
      `${this.baseUrl}/passwords/${id}`,
      password
    );
  }

  public createPassword(password: passwordDTO) {
    return this.http.post<createPasswordResponseDTO>(
      `${this.baseUrl}/passwords`,
      password
    );
  }

  public export() {
    return this.http.get<exportPasswordsDTO>(
      `${this.baseUrl}/passwords/export`
    );
  }

  public import(data: exportPasswordsDTO) {
    return this.http.post<messageDTO>(`${this.baseUrl}/passwords/import`, data);
  }

  public delete(id: string) {
    return this.http.delete<messageDTO>(`${this.baseUrl}/passwords/${id}`);
  }

  public togglePreferred(id: string) {
    return this.http.post<messageDTO>(
      `${this.baseUrl}/passwords/${id}/toggle-preferred`,
      {}
    );
  }
}
