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
        `${environment.baseUrl}/api/passwords/password?search=${
          search ? search : ''
        }`
      )
      .toPromise();
  }

  public async getPassword(id: string): Promise<passwordDTO> {
    return this.http
      .get<passwordDTO>(`${environment.baseUrl}/api/passwords/password/${id}`)
      .toPromise();
  }

  public async updatePassword(
    id: string,
    password: passwordDTO
  ): Promise<messageDTO> {
    return this.http
      .put<messageDTO>(
        `${environment.baseUrl}/api/passwords/password/${id}`,
        password
      )
      .toPromise();
  }

  public async createPassword(
    password: passwordDTO
  ): Promise<createPasswordResponseDTO> {
    return this.http
      .post<createPasswordResponseDTO>(
        `${environment.baseUrl}/api/passwords`,
        password
      )
      .toPromise();
  }

  public async export(): Promise<exportPasswordsDTO> {
    return this.http
      .get<exportPasswordsDTO>(`${environment.baseUrl}/api/passwords/export`)
      .toPromise();
  }

  public async import(data: exportPasswordsDTO): Promise<messageDTO> {
    return this.http
      .post<messageDTO>(`${environment.baseUrl}/api/passwords/import`, data)
      .toPromise();
  }

  public async delete(id: string): Promise<messageDTO> {
    return this.http
      .delete<messageDTO>(`${environment.baseUrl}/api/passwords/password/${id}`)
      .toPromise();
  }
}
