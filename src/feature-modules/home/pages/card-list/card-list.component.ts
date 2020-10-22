import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { CardsService } from '@core-modules/core/services/cards.service';
import { CardModel } from '@core-modules/core/models/card.model';


@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
 
  //exemplo para teste, será preciso API para ir buscar este conteudo.
  name: string = "Martins de Brito";
  rankClass: string = "CMG FZ";
  totalRegistos: number = 300;
  cardNumber: string = "M0001";
  cardUid: string = "US12324235322";
  addDate: string = "17/01/2020";
  cardType: string = "Militar";
  lastRegist: string = "12/09/2020";
  cardStatus: string = "Activo";
  cardStatusColor: string = "label-success"


  cards: CardModel[];
  private _docSub: Subscription;

  constructor(private layoutConfigService: LayoutConfigService, private cardService: CardService, private cardsService: CardsService) {
    super();

    
  }

  ngOnInit() {
    this._docSub = this.cardService.notification.subscribe(data => {
      console.log('event', data);

      // save uuid to input
    });

    console.log('Get cards');
    this.cardsService.getCards().subscribe((data: any) => {
      console.log('cards', data);

      this.cards = [];
      data.cards.forEach(card => {
        const c = {...card};

        c.cardStatusColor = "label-success";

        this.cards.push(c);
      });

    });
  }




  
  


}
