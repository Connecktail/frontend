import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CartModalComponent } from 'src/app/component/cart-modal/cart-modal/cart-modal.component';
import { CocktailModalComponent } from 'src/app/component/cocktail-modal/cocktail-modal.component';
import { WebsocketService } from 'src/app/service/websocket.service';

@Component({
  selector: 'app-list-cocktails',
  templateUrl: './list-cocktails.component.html',
  styleUrls: ['./list-cocktails.component.scss'],
})
export class ListCocktailsComponent implements OnInit {
  cocktails: any = [];
  isModalOpen: boolean = false;
  selectedCocktail: any;

  constructor(
    private websocketService: WebsocketService,
    public modalController: ModalController,
    private toastController: ToastController
  ) { 
    this.websocketService.$successConnected.subscribe((msg) => {
      let message = {
        "action" : "get_cocktails"
      };
      this.websocketService.sendMessage(message);
    });
    if(this.websocketService.connected) {
      let message = {
        "action" : "get_cocktails"
      };
      this.websocketService.sendMessage(message);
    }

    this.websocketService.$messageResponse.subscribe((msg) => {
      this.cocktails = msg.cocktails;
    });
  }
  
  ngOnInit(): void {
    
  }
  
  
  ionViewDidEnter() {
    this.websocketService.$messageResponse.subscribe((msg) => {
      this.cocktails = msg.cocktails;
    });
  }


  async cocktailSelected(event: any) {
    this.selectedCocktail = event;
    this.isModalOpen = true;
    const modal = await this.modalController.create({
      component: CocktailModalComponent,
      cssClass: 'cocktail-modal',
      componentProps: {
        "cocktail": event,
      }
    });

    modal.present();

    let resp = await modal.onWillDismiss();
    if(resp.data == "addedToCart") {
      const toast = await this.toastController.create({
        message: 'Cocktail added to cart',
        duration: 1500,
        position: "bottom",
        color: "success",
        icon: "checkmark-circle-outline",
        cssClass: "toast-success"
      });
  
      await toast.present();
      
    }
  }

  onCloseModal(event: any) {
    this.isModalOpen = false;
  }

  async openCartModal() {
    const modal = await this.modalController.create({
      component: CartModalComponent,
      cssClass: 'cart-modal'
    });

    modal.present();

    let resp = await modal.onWillDismiss();
  }

  ionViewDidLeave(){
    this.websocketService.$messageResponse.unsubscribe();
  }
}
