import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from './ip.js';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  logInUser(user) {
    return this.http.post<any>('http://' + ip + '/api/user/auth', user);
  }

  logoutUser() {
    localStorage.removeItem('JWT');
    this.router.navigate(['/login']);
  }

  isLogged() {
    return !!localStorage.getItem('JWT');
  }
  getRole() {
    const token = localStorage.getItem('JWT');
    const decoded = jwt_decode(token);
    return decoded.role;
  }

  getName(): string {
    const token = localStorage.getItem('JWT');
    const decoded = jwt_decode(token);
    return decoded.name;
  }

  getToken() {
    return localStorage.getItem('JWT');
  }
}
