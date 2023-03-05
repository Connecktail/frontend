import { Component } from '@angular/core';
import { Message, WebsocketService } from './service/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'socketrv';
  content = 'Bouton Commander';
  received : Message[] = [];
  sent: {}[] = [];

  constructor(private WebsocketService: WebsocketService) {
    WebsocketService.messages.subscribe((msg) => {
      this.received.push(msg);
      console.log("Response from websocket:", msg);
    });
  }

  sendMsg() {
    console.log("SENDMSG");
    let message = {
      "action" : "get_bottles"
    };
   
    // message.source = 'localhost';
    // message.content = this.content;

    this.sent.push(message);
    this.WebsocketService.messages.next(message);
  }

}
