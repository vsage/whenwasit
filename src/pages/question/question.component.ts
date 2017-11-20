import { Component, OnInit } from "@angular/core";
import { Platform, NavParams, ViewController } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { QuestionService } from "./question.service";

import * as _ from "underscore";

@Component({
  selector: "question",
  templateUrl: "question.html",
  providers: [QuestionService]
})
export class QuestionPage implements OnInit {
  answerValue: any;
  hint: number = 0;
  question: any;
  index: number = 0;
  score: number = 0;
  best: number;
  hidden1 = -1;
  hidden2 = -1;
  questionsArray: any[];
  category: string;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public questionService: QuestionService,
    private storage: Storage
  ) {}

  setQuestions(res) {
    this.questionsArray = res;
    this.question = res[this.index];
  }

  ngOnInit() {
    this.category = this.params.get("category");
    this.questionService
      .getQuestionList(this.category)
      .subscribe(res => this.setQuestions(res));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  answerQuestion(answer) {
    let realAnswer = this.hint == 0 ? this.answerValue : answer.answer;
    let filteredAnswer = _.filter(this.question.answers, ans => {
      return ans.answer == realAnswer;
    });
    if (filteredAnswer.length > 0 && filteredAnswer[0].right == "yes") {
      this.presentToast("Well played !");
      switch (this.hint) {
        case 0: {
          this.score += 20;
          break;
        }
        case 1: {
          this.score += 10;
          break;
        }
        case 2: {
          this.score += 5;
          break;
        }
      }
    } else {
      this.presentToast("Oops !");
    }
    this.answerValue = "";
    this.index += 1;
    this.question = this.questionsArray[this.index];
    this.hint = 0;
    this.hidden1 = -1;
    this.hidden2 = -1;

    if (this.index == 9) {
      this.storage.get("best_" + this.category).then(
        val => {
          if (val) {
            this.best = Math.max(val, this.score);
            if (val<this.score) { this.storage.set("best_" + this.category, this.score); }
          } else {
            this.storage.set("best_" + this.category, this.score);
            this.best = this.score;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  giveHint() {
    if (this.hint == 1) {
      let wrongAnswerIndex = _.findIndex(this.question.answers, ans => {
        return ans.right == "yes";
      });
      let possibleRemoveIndices = _.difference(
        [0, 1, 2, 3],
        [wrongAnswerIndex]
      );
      let firstRand = Math.floor(Math.random() * 3);
      let secondRand = (firstRand + Math.floor(Math.random() * 2) + 1) % 3;
      this.hidden1 = possibleRemoveIndices[firstRand];
      this.hidden2 = possibleRemoveIndices[secondRand];
      // console.log(this.hidden1, otherRand, this.hidden2)
    }
    this.hint += 1;
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: "bottom"
    });
    toast.present();
  }
}
