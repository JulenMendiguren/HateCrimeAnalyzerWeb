import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from './ip.js';

@Injectable({
  providedIn: 'root',
})
export class ColectivesService {
  constructor(private http: HttpClient) {}

  getAllColectives() {
    return this.http.get<any>('http://' + ip + '/api/colective/all');
  }
  deteleColectiveById(_id) {
    return this.http.delete<any>('http://' + ip + '/api/colective/id/' + _id);
  }
  updateColective(colective) {
    return this.http.post<any>(
      'http://' + ip + '/api/colective/update/',
      colective
    );
  }
  createColective(colective) {
    return this.http.post<any>(
      'http://' + ip + '/api/colective/one/',
      colective
    );
  }
}
