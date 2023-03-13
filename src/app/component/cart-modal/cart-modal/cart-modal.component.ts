import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit {
  cart: any;
  totalPrice: number = 0;

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    this.cart = await this.storageService.get('cart');
    for (let i = 0; i < this.cart.length; i++) {
      this.totalPrice += this.cart[i].price;
    }
  }

  closeModalEvent() {
    return this.modalCtrl.dismiss();
  }
}
