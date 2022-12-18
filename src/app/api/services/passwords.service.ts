import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  constructor(private http: HttpClient) {}

  public async getAll(): Promise<unknown> {
    return this.http.get(`${environment.baseUrl}/passwords/all`).toPromise();
  }
}
