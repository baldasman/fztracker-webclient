import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class CardService {
  notification = this.socket.fromEvent<any>('card');

  constructor(private socket: Socket) { 
    console.log('CardService', this.notification);
  }
  
  // newDocument() {
  //   this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  // }

}