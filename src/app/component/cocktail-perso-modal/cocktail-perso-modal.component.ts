import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, NavParams, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cocktail-perso-modal',
  templateUrl: './cocktail-perso-modal.component.html',
  styleUrls: ['./cocktail-perso-modal.component.scss'],
})
export class CocktailPersoModalComponent implements OnInit {
  cart: any;
  totalPrice: number = 0;
  totalNumber: number = 0;
  cocktailNumberChangedSubscription: Subscription | undefined;
  bottles: any = [];
  nbBottles: number = 0;

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private route: Router,
    private modalController: ModalController,
    private navParams: NavParams,
    private toastController: ToastController
  ) {
    this.cart = [];
  }

  async ngOnInit(){
    this.bottles = JSON.parse(JSON.stringify(this.navParams.get("bottles")));

    this.bottles.forEach((bottle: any) => {
      bottle.checked = false;
    });
  }

  bottleChecked(data: any) {
    let bottle = data.bottle;
    bottle["checked"] = data.checked;

    let bottleIndex = this.bottles.findIndex((b:any) => b.id == bottle.id);

    if(bottle["checked"]) {
      this.bottles.splice(bottleIndex, 1);
      this.bottles.splice(this.nbBottles, 0, bottle);
      bottle.quantity = 1;
  
      this.nbBottles += 1;
    } else {

      this.bottles.splice(bottleIndex, 1);
      this.bottles.splice(this.nbBottles-1, 0, bottle);
      bottle.quantity = null;

      this.nbBottles -= 1;
    }
  }

  async addCocktailToCart() {
    let cocktail = {
      "id": null,
      "name": "Personalized Cocktail",
      "items": <any>[],
      "price": 16,
      "number": 1,
      "perso_id": 0
    };
    
    if(this.bottles.findIndex((bottle:any) => bottle.checked == true && bottle.quantity < 1) != -1) {

      const toast = await this.toastController.create({
        message: 'All quantities must be superior or equal to 1',
        duration: 1500,
        position: "bottom",
        color: "danger",
        icon: "checkmark-circle-outline",
        cssClass: "toast-error"
      });
  
      await toast.present();

      return;
    }

    this.bottles.forEach((bottle: any) => {
      if(bottle.checked && bottle.quantity > 0) {
        cocktail.items.push(bottle);
      }
    })

    let perso_id = await this.storageService.generateCocktailPersoLastId();

    cocktail.perso_id = perso_id==null?1:perso_id;

    this.storageService.addCocktailToCart(cocktail);
    return this.modalCtrl.dismiss("addedToCart");
  }

  handleReorder(event: any) {
    let items = event.detail.complete(this.bottles);
  }


  closeModalEvent() {
    return this.modalCtrl.dismiss();
  }
}
