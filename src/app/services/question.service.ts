import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from './ip.js';
import { Question } from '../models/question.js';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  createQuestion(question: Question) {
    return this.http.post<any>('http://' + ip + '/api/question/one/', question);
  }
}
