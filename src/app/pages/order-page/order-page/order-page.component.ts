import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/service/websocket.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {

  constructor(
    private websocketService: WebsocketService
  ) { 
    this.websocketService.$messageResponse.subscribe((msg) => {
      console.log("Response from websocket:", msg);
    });
  }

  ngOnInit() {}

}