import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from './ip.js';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  logInUser(user) {
    return this.http.post<any>('http://' + ip + '/api/user/auth', user);
  }

  isLogged() {
    return !!localStorage.getItem('JWT');
  }
}
