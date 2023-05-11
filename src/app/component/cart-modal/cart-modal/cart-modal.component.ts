import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit {
  cart: any;
  totalPrice: number = 0;
  totalNumber: number = 0;
  cocktailNumberChangedSubscription: Subscription | undefined;

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private route: Router
  ) {
    this.cart = [];
  }

  async ngOnInit(){
    this.cart = await this.storageService.get('cart');
    for (let i = 0; i < this.cart.length; i++) {
      this.totalPrice += this.cart[i].price*this.cart[i].number;
      this.totalNumber += this.cart[i].number;
    }


    this.cocktailNumberChangedSubscription = this.storageService.$cocktailNumberChanged.subscribe(async (res) => {
      let cart = await this.storageService.get('cart');

      if(!res.deleted) {
        let cocktailIndex: number = -1;
        if(res.cocktailId) {
          cocktailIndex = cart.findIndex((c: any) => c.id == res.cocktailId);
        } else if(res.cocktailPersoId) {
          cocktailIndex = cart.findIndex((c: any) => c.perso_id == res.cocktailPersoId);
        }
        if(cocktailIndex != -1) {
          this.totalPrice +=  (cart[cocktailIndex].number - this.cart[cocktailIndex].number)*this.cart[cocktailIndex].price;
          this.totalNumber += cart[cocktailIndex].number - this.cart[cocktailIndex].number;
          this.cart[cocktailIndex].number = cart[cocktailIndex].number;
        }
      } else {
        let cocktailIndex = this.cart.findIndex((c: any) => c.id == res.cocktailId);
        if(cocktailIndex != -1) {
          this.totalPrice -= this.cart[cocktailIndex].price*this.cart[cocktailIndex].number;
          this.totalNumber -= this.cart[cocktailIndex].number;
          this.cart.splice(cocktailIndex, 1);
        }
      }
    });
  }

  goToCheckout() {
    this.route.navigate(['/list-commands']);
    return this.modalCtrl.dismiss();
  }


  closeModalEvent() {
    return this.modalCtrl.dismiss();
  }
}
