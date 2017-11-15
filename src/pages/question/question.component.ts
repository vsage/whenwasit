import { Component } from "@angular/core";
import { Platform, NavParams, ViewController } from "ionic-angular";
import { ToastController } from 'ionic-angular';

import * as _ from 'underscore';

@Component({
  selector: "question",
  templateUrl: "question.html"
})
export class QuestionPage {

  answerValue: any;
  hint: number = 0;
  question: any;
  index: number = 0;
  score: number = 0;
  hidden1 = -1;
  hidden2 = -1;
  questionsArray= [
    {
      question: "Quand est décédé Michael Jackson ?",
      answers: [
        {
          answer: "2009",
          right: "yes"
        },
        {
          answer: "2010",
          right: "no"
        },
        {
          answer: "2011",
          right: "no"
        },
        {
          answer: "2012",
          right: "no"
        }
      ]
    },
    {
      question: "Quand est décédé Jacques Villeret ?",
      answers: [
        {
          answer: "2009",
          right: "yes"
        },
        {
          answer: "2010",
          right: "no"
        },
        {
          answer: "2011",
          right: "no"
        },
        {
          answer: "2012",
          right: "no"
        }
      ]
    }
  ];



  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController
  ) {
    this.question = this.questionsArray[this.index];
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  answerQuestion(answer) {

    let realAnswer = this.hint == 0 ? this.answerValue : answer.answer;
    let filteredAnswer = _.filter(this.question.answers, (ans) => {
      return ans.answer == realAnswer;
    })
    if (filteredAnswer.length>0 && filteredAnswer[0].right=="yes") {
      this.presentToast("Well played !")
      switch(this.hint) {
         case 0: {
            this.score+=20;
            break;
         }
         case 1: {
            this.score+=10;
            break;
         }
         case 2: {
            this.score+=5;
            break;
         }
      }
    }
    else {
      this.presentToast("NOOB !")
    }
    this.answerValue = '';
    this.index += 1;
    this.question = this.questionsArray[this.index];
    this.hint = 0;
  }

  giveHint(){
    if (this.hint == 1){
      let wrongAnswerIndex = _.findIndex(this.question.answers, (ans) => {
        return ans.right == "yes";
      })
      let possibleRemoveIndices = _.difference([0,1,2,3], [wrongAnswerIndex])
      let firstRand = Math.floor((Math.random() * 3));
      let secondRand = (firstRand + Math.floor((Math.random() * 2)) + 1) % 3;
      console.log(possibleRemoveIndices)
      console.log(firstRand, secondRand)
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
      position: "top"
    });
    toast.present();
  }

}
