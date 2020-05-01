import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from './ip.js';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<any>('http://' + ip + '/api/user/all');
  }
  deteleUserById(_id) {
    return this.http.delete<any>('http://' + ip + '/api/user/id/' + _id);
  }
  updateUser(user) {
    return this.http.post<any>('http://' + ip + '/api/user/update/', user);
  }
  createUser(user) {
    return this.http.post<any>('http://' + ip + '/api/user/one/', user);
  }
}
