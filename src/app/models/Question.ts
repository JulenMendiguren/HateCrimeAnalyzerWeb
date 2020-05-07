import { Options } from './Options';

export interface Question {
  _id?: string;
  text_eu: string;
  text_es: string;
  text_en: string;
  text_fr: string;
  type: string;
  tag: string;
  possibleAnswers_eu?: string[];
  possibleAnswers_es?: string[];
  possibleAnswers_en?: string[];
  possibleAnswers_fr?: string[];
  options: Options;
}
