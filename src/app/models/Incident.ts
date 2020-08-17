import { Questionnaire } from './Questionnaire';
import { Answer } from './Answer';

export interface Incident {
  _id: string;
  questionnaire: Questionnaire;
  answers: Answer[];
  userQuestionnaire: Questionnaire;
  userAnswers: Answer[];
  userCol: string[];
  createdAt: string;
}
