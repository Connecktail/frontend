import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cocktail-modal',
  templateUrl: './cocktail-modal.component.html',
  styleUrls: ['./cocktail-modal.component.scss'],
})
export class CocktailModalComponent implements OnInit {
  @Input() cocktail: any;
  @Input() isModalOpen: boolean = true;

  @Output () closeModal: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService
  ) {
    this.cocktail = {
      "name": "",
      "description": "",
      "price": 0,
      "image_url": ""
    }
  }

  ngOnInit() {
  }

  closeModalEvent() {
    return this.modalCtrl.dismiss();
  }

  setImageUrl() {
    this.cocktail.image_url = "assets/img/default-cocktail.jpg";
  }

  async addToCart() {
    this.storageService.addCocktailToCart(this.cocktail);

    return this.modalCtrl.dismiss("addedToCart");
  }

}
