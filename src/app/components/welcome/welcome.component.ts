import {Component} from '@angular/core';
import {Question} from "../../models/question.model";
import {QuizService} from "../../services/quiz.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {

  questions: Array<Question> = [];
  isSubmitActive: boolean = false;
  constructor(private quizService: QuizService, private router: Router) {}

  initQuestions(event: Array<Question>): void {
    this.questions = event;
  }

  onAnswer(iQuestion: number, iAnswer: number): void {
    const selectedQuestion: Question = this.questions[iQuestion];
    selectedQuestion.user_answer = selectedQuestion.answers[iAnswer];
    this.setIsSubmitActive();
  }

  setIsSubmitActive(): void {
    this.isSubmitActive = this.questions.every((question: Question) => question.user_answer)
  }

  onSubmit(): void {
    this.quizService.questions = this.questions;
    this.quizService.score = this.getScore();
    this.router.navigateByUrl('/results');
  }

  private getScore(): number {
    return this.questions
      .filter((question: Question) => question.user_answer === question.correct_answer)
      .length;
  }
}
