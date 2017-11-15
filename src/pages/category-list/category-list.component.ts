import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { QuestionPage } from '../question/question.component'

@Component({
  selector: 'category-list',
  templateUrl: 'category-list.html'
})
export class CategoryListPage {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController) {

  }

  openModal(category) {
    let modal = this.modalCtrl.create(QuestionPage, category);
    modal.present();
  }


}
