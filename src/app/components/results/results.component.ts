import {Component} from "@angular/core";
import {Question} from "../../models/question.model";
import {QuizService} from "../../services/quiz.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent {

  questions: Array<Question>;
  score: number;

  constructor(private quizService: QuizService, private router: Router) {
    if (this.quizService.questions.length === 0) {
      this.router.navigateByUrl('/welcome');
    }
    this.questions = this.quizService.questions;
    this.score = this.quizService.score;
  }

  onCreatenewQuiz(): void {
    this.quizService.questions = [];
    this.score = 0;
    this.router.navigateByUrl('/welcome');
  }

}
