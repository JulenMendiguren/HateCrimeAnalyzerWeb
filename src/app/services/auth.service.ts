import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from './ip.js';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  logInUser(user) {
    this.http.post<any>('http://' + ip, user);
  }
}
