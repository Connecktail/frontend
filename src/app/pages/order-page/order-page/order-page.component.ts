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
  cart: Array<any> = [];
  totalPrice: number = 0;
  totalNumber: number = 0;
  cocktailNumberChangedSubscription: Subscription | undefined;
  currentOrder: any = {
    percentage: 0,
    step: 0,
    total_step: 0,
    bottle: 0,
    total_bottle: 0,
    message: ""
  };
  orderPassed: boolean = false;
  currentStep: number = 0;


  constructor(
    private storageService: StorageService,
    private websocketService: WebsocketService,
    private alertController: AlertController
  ) { 
    this.websocketService.$successConnected.subscribe((msg) => {
      let message = {
        "action" : "check_order"
      };
      this.websocketService.sendMessage(message);
    });
    if(this.websocketService.connected) {
      let message = {
        "action" : "check_order"
      };
      this.websocketService.sendMessage(message);
    }

    this.cart = [];

    this.websocketService.$messageResponse.subscribe((msg) => {
      if(msg.action == "status") {
        this.updateStatus(msg);
      }
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

    this.websocketService.$messageResponse.subscribe((msg) => {
      if(msg.action == "status") {
        this.updateStatus(msg);
      }
    });
  }

  updateStatus(msg: any) {
    if(!this.orderPassed) {
      this.orderPassed = true;
      
      if(msg.total_bottle != 0) {
        this.currentOrder.step = msg.step;
      }
    }
    
    this.currentOrder.total_step = msg.total_step;
    this.currentOrder.total_cocktail = msg.total_cocktail;
    this.currentOrder.cocktail = msg.cocktail;
    this.currentOrder.total_bottle = msg.total_bottle;
    this.currentOrder.bottle = msg.bottle;
    this.currentOrder.message = msg.message;

    this.currentOrder.percentage = (this.currentOrder.step/this.currentOrder.total_step)*100;
    
    this.currentOrder.step = msg.step;

    let totalStep = 1;
    for(let i = 0; i < this.cart.length; i++) {
      totalStep += this.cart[i].number;
      if(totalStep > this.currentOrder.cocktail) {
        this.currentStep = i;
        break;
      }
    }
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
      if(this.cart[i].id != null) {
        req.order.cocktails.push({
          "recipe": this.cart[i].id,
          "number": this.cart[i].number,
          "perso": false
        });
      } else {
        req.order.cocktails.push({
          "recipe": null,
          "items": this.cart[i].items,
          "price": this.cart[i].price,
          "perso": true
        });
      }
    }

    this.websocketService.sendMessage(req);
  }


  ionViewDidLeave(){
    this.websocketService.$messageResponse.unsubscribe();
  }
}


