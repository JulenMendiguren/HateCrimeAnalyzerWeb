import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from './ip.js';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  constructor(private http: HttpClient) {}

  getReportVersions() {
    return this.http.get<any>(
      'http://' + ip + '/api/questionnaire/versions/report'
    );
  }
}
