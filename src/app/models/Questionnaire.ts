import { Question } from './question';

export interface Questionnaire {
  _id?: string;
  questions: Question[];
  category: string;
}
