import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from './ip.js';
import { Questionnaire } from '../models/Questionnaire.js';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private http: HttpClient) {}

  getLastUserQ() {
    return this.http.get<any>('http://' + ip + '/api/questionnaire/last/user');
  }

  getLastReportQ() {
    return this.http.get<any>(
      'http://' + ip + '/api/questionnaire/last/report'
    );
  }

  createNewQ(questionnaire: Questionnaire) {
    return this.http.post<any>(
      'http://' + ip + '/api/questionnaire/one',
      questionnaire
    );
  }
}
