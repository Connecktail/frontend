import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
    public modalController: ModalController
  ) { 
    this.websocketService.$successConnected.subscribe((msg) => {
      let message = {
        "action" : "get_cocktails"
      };
      this.websocketService.sendMessage(message);

    });
    this.websocketService.$messageResponse.subscribe((msg) => {
      console.log("Response from websocket:", msg);
      this.cocktails = msg.cocktails;
    });
  }

  ngOnInit() {
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

    await modal.onWillDismiss();
  }

  onCloseModal(event: any) {
    this.isModalOpen = false;
  }

}
