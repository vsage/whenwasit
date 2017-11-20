import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class QuestionService {
  questionsArray: any[];

  constructor (public http: Http) {

  }

  getQuestionList(category) {
    return this.http.get('https://whenwasit.herokuapp.com/list_questions?category='+category, {
    }).map( (res) => res.json() )
  }
}
