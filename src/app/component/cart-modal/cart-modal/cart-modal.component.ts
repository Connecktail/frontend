import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
    private storageService: StorageService
  ) {
    this.cart = [];
  }

  async ngOnInit(){
    this.cart = await this.storageService.get('cart');
    for (let i = 0; i < this.cart.length; i++) {
      this.totalPrice += this.cart[i].price*this.cart[i].number;
      this.totalNumber += this.cart[i].number;
    }


    this.cocktailNumberChangedSubscription = this.storageService.$cocktailNumberChanged.subscribe(async () => {
      this.cart = await this.storageService.get('cart');
      this.totalPrice = 0;
      this.totalNumber = 0;
      for (let i = 0; i < this.cart.length; i++) {
        this.totalPrice += this.cart[i].price*this.cart[i].number;
        this.totalNumber += this.cart[i].number;
      }
    });
  }


  closeModalEvent() {
    return this.modalCtrl.dismiss();
  }
}
