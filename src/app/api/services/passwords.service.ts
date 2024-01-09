import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  createPasswordResponseDTO,
  exportPasswordsDTO,
  passwordDTO,
} from '../Models/password/passwordDTO';
import { messageDTO } from '../Models/messageDTO';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  constructor(private http: HttpClient) {}

  public async search(search: string | undefined): Promise<passwordDTO[]> {
    return this.http
      .get<passwordDTO[]>(
        `${environment.baseUrl}/passwords/password?search=${
          search ? search : ''
        }`
      )
      .toPromise();
  }

  public async getAllPasswords(): Promise<passwordDTO[]> {
    return this.http
      .get<passwordDTO[]>(`${environment.baseUrl}/passwords`)
      .toPromise();
  }

  public async getPassword(id: string): Promise<passwordDTO> {
    return this.http
      .get<passwordDTO>(`${environment.baseUrl}/passwords/${id}`)
      .toPromise();
  }

  public async updatePassword(
    id: string,
    password: passwordDTO
  ): Promise<messageDTO> {
    return this.http
      .put<messageDTO>(`${environment.baseUrl}/passwords/${id}`, password)
      .toPromise();
  }

  public async createPassword(
    password: passwordDTO
  ): Promise<createPasswordResponseDTO> {
    return this.http
      .post<createPasswordResponseDTO>(
        `${environment.baseUrl}/passwords`,
        password
      )
      .toPromise();
  }

  public async export(): Promise<exportPasswordsDTO> {
    return this.http
      .get<exportPasswordsDTO>(`${environment.baseUrl}/passwords/export`)
      .toPromise();
  }

  public async import(data: exportPasswordsDTO): Promise<messageDTO> {
    return this.http
      .post<messageDTO>(`${environment.baseUrl}/passwords/import`, data)
      .toPromise();
  }

  public async delete(id: string): Promise<messageDTO> {
    return this.http
      .delete<messageDTO>(`${environment.baseUrl}/passwords/password/${id}`)
      .toPromise();
  }
}
