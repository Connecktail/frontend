import { Component } from '@angular/core';
import { Message } from './service/websocket.service';

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

  constructor() {
  }

}
