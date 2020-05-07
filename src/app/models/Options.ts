export interface Options {
  required: boolean;
  subquestionOf?: string;
  requiredAnswerIndex?: number;
  size?: string;
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  slider?: boolean;
  datetimeFormat?: string;
}
