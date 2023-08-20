import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {Categories} from "../../models/categories.model";
import {map, Observable, Subscription} from "rxjs";
import {Category} from "../../models/category.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Question} from "../../models/question.model";
import {Difficulty} from "../../models/difficulty.enum";
import {Questions} from "../../models/questions.model";

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
})
export class ParametersComponent implements OnDestroy {

  categories$: Observable<Array<Category>>;
  difficulties: Array<Difficulty>;
  parametersFromGroup: FormGroup;
  subscription?: Subscription;
  @Output()
  questionsEmitter: EventEmitter<Array<Question>> = new EventEmitter();
  constructor(private quizService: QuizService, private formBuilder: FormBuilder) {
    this. parametersFromGroup = this.initParametersFormGroup();
    this.categories$ = this.initCategories();
    this.difficulties = this.initDifficulties();
  }

  private initCategories(): Observable<Array<Category>> {
    return this.quizService.getCategories()
      .pipe(
        map((categories: Categories) => categories.trivia_categories)
      );
  }

  private initDifficulties(): Array<Difficulty> {
    return  Object.values(Difficulty);
  }

  private initParametersFormGroup(): FormGroup {
    return this.formBuilder.group({
      category: [null, {validators: [Validators.required]}],
      difficulty: [null, {validators: [Validators.required]}]
    });
  }

  onCreate(): void {
    const categoryId = this.parametersFromGroup.get('category')?.value!;
    const difficulty = this.parametersFromGroup.get('difficulty')?.value!;
    this.subscription = this.quizService.getQuestions(categoryId, difficulty)
      .subscribe((resp: Questions): void => {
        let questions: Array<Question> = this.getRandomizedAnswers(resp.results);
        questions = this.getFormattedQuestions(questions);
        this.questionsEmitter.emit(questions);
      })

  }

  private getRandomizedAnswers(questions: Array<Question>): Array<Question> {
    return questions
      .map((question: Question) => {
        let answers: Array<string> = [];
        answers.push(question.correct_answer);
        answers.push(...question.incorrect_answers);
        answers = answers
          .map((value: string) => ({value, sort: Math.random()}))
          .sort((a: {value: string, sort: number}, b: {value: string, sort: number}) => a.sort - b.sort)
          .map(({value}) => value);
        question.answers = answers;
        return question;
      });
  }

  private getFormattedQuestions(questions: Array<Question>): Array<Question> {
    questions.forEach((question: Question) => {
      question.answers = question.answers.map((answer: string) => this.getFormattedText(answer));
      question.question = this.getFormattedText(question.question);
    });
    return questions;
  }

  private getFormattedText(text: string): string {
    const textarea: HTMLTextAreaElement  = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
