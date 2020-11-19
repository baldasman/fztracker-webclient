import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';


@Component({
  selector: 'app-card-controlViewer',
  templateUrl: './card-controlViewer.component.html',
  styleUrls: ['./card-controlViewer.component.scss']
})
export class CardControlViewerComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
  
  name: string = "Isabel Pereira";
  rankClass: string = "Civil";
  MovimentsDay: Date = new Date(); 
  cardNumber: string = "C0001";
  cardUid: string = "US12324235322";
  movdate: string = "17/01/2020";
  movhora: string = "10:25";
  lastRegist: string = "12/09/2020";
  cardStatus: string = "Entrou";
  cardStatusColor: string = "label-success"
  urlImage : string = "assets/media/users/1212.jpg";
  totalRegistos: number = 300;
  notas: string = "entrou sem cartão";
  model;
  model2;
  private _docSub: Subscription;

  constructor(private layoutConfigService: LayoutConfigService, private cardService: CardService) {
    super();

    
  }

  ngOnInit() {
    this._docSub = this.cardService.notification.subscribe(data => {
      console.log('event', data);

      // save uuid to input
    });
 







}
}
