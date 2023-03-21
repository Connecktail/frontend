import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/service/storage.service';
import { WebsocketService } from 'src/app/service/websocket.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {
  cart: any;
  totalPrice: number = 0;
  totalNumber: number = 0;
  cocktailNumberChangedSubscription: Subscription | undefined;

  constructor(
    private storageService: StorageService,
    private websocketService: WebsocketService,
    private alertController: AlertController
  ) { 
    this.cart = [];
    this.websocketService.$messageResponse.subscribe((msg) => {
      console.log("Response from websocket:", msg);
    });
  }

  ionViewDidEnter(){
    setTimeout(async () => {
      this.cart = await this.storageService.get('cart');

      for (let i = 0; i < this.cart.length; i++) {
        this.totalPrice += this.cart[i].price*this.cart[i].number;
        this.totalNumber += this.cart[i].number;
      }
    }, 0);
  }

  async ngOnInit(){
    this.cocktailNumberChangedSubscription = this.storageService.$cocktailNumberChanged.subscribe(async (res) => {
      let cart = await this.storageService.get('cart');

      if(!res.deleted) {
        let cocktailIndex = cart.findIndex((c: any) => c.id == res.cocktailId);
        if(cocktailIndex != -1 && cart[cocktailIndex].id == res.cocktailId) {
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

  async openValidateOrderModal() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to validate your order ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.validateOrder();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async validateOrder() { 
    let req = {
      "action" : "order",
      "order" : {
        "total": this.totalPrice,
        "cocktails": <any>[]
      }
    };

    this.cart = await this.storageService.get('cart');
    for(let i = 0; i < this.cart.length; i++) {
      req.order.cocktails.push({
        "recipe": this.cart[i].id,
        "number": this.cart[i].number
      });
    }

    this.websocketService.sendMessage(req);
  }
}


