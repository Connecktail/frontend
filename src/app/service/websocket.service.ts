// src\app\services\websocket.service.ts
import { Injectable } from "@angular/core";
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/assets/config/conf';

const CHAT_URL = "ws://" + environment.websocket_ip + ":" + environment.websocket_port;

export interface Message {
    action: string
}

@Injectable()
export class WebsocketService {
    private subject: AnonymousSubject<MessageEvent> | undefined;
    public $messageResponse: Subject<any> = new Subject<any>();
    public $successConnected: Subject<any> = new Subject<any>();
    public connected: boolean = false;

    constructor() {
        this.$messageResponse = <Subject<any>>this.connect(CHAT_URL).pipe(
            map(
                (response: MessageEvent): any => {
                    let data = JSON.parse(response.data);
                    return data;
                }
            )
        );
    }

    public connect(url: string): AnonymousSubject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    }

    private create(url: string): AnonymousSubject<MessageEvent> {
        let ws = new WebSocket(url);
        let observable = new Observable((obs: Observer<MessageEvent>) => {
            ws.onopen = (event) => {
                this.$successConnected.next(true);
                this.connected = true;
            }
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        });
        let observer = {
            error: (error: Object) => {},
            complete: () => {},
            next: (data: Object) => {
                console.log('Message sent to websocket: ', data);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };
        return new AnonymousSubject<MessageEvent>(observer, observable);
    }

    public sendMessage(message: any) {
        this.$messageResponse.next(message);
    }
}
