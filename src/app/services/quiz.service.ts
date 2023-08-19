import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Categories} from "../models/categories.model";
import {Question} from "../models/question.model";
import {Questions} from "../models/questions.model";

@Injectable({
  providedIn: 'root',
})
export class QuizService {

  questions: Array<Question> = [];
  score: number = 0;

  constructor(private readonly httpClient: HttpClient) {}
  getCategories(): Observable<Categories> {
    return this.httpClient.get<Categories>('https://opentdb.com/api_category.php');
  }

  getQuestions(categoryId: string, difficulty: string): Observable<Questions> {
    const api = this.getQuestionsUrl(categoryId, difficulty);
    return this.httpClient.get<Questions>(api);
  }

  private getQuestionsUrl(categoryId: string, difficultyLevel: string): string {
    const url: string = "https://opentdb.com/api.php?";
    const amount: string = "amount=5";
    const category: string = "&category=" + categoryId;
    const difficulty: string = "&difficulty=" + difficultyLevel.toLowerCase();
    const type: string = "&type=multiple";
    return url + amount + category + difficulty + type;
  }
}
