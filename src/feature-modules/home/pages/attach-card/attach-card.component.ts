import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';



@Component({
  selector: 'app-attach-card',
  templateUrl: './attach-card.component.html',
  styleUrls: ['./attach-card.component.scss']
})
export class AttachCardComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  FindNii : string ="";
  Name : string;
  RankClass: string;

  private _docSub: Subscription;

  constructor(private cardService: CardService) {
    super();


  }

  ngOnInit() {
    this._docSub = this.cardService.notification.subscribe(data => {
      console.log('event', data);

      // save uuid to input
    });
 
    

  }


  FindNum() {
    console.log("ligar a BD"+ this.FindNii)

  }

    }


