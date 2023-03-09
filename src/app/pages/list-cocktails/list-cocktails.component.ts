import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/service/websocket.service';

@Component({
  selector: 'app-list-cocktails',
  templateUrl: './list-cocktails.component.html',
  styleUrls: ['./list-cocktails.component.scss'],
})
export class ListCocktailsComponent implements OnInit {
  cocktails: any = [];

  constructor(
    private websocketService: WebsocketService
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

}
