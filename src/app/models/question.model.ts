export interface Question {
  question: string;
  user_answer?: string;
  answers: Array<string>;
  correct_answer: string;
  incorrect_answers: Array<string>;
}
