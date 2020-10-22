import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { CardsService } from '@core-modules/core/services/cards.service';
import { CardModel } from '@core-modules/core/models/card.model';
import { uniqueId } from 'lodash';
import { EntityModel } from '@core-modules/core/models/entity.model';
import { EntityService } from '@core-modules/core/services/entity.service';
;


@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
 
  //exemplo para teste, será preciso API para ir buscar este conteudo.
  name: string = "Martins de Brito";
  rankClass: string = "CMG FZ";
  cardNumber: string = "M0001";
  cardUid: string = "US12324235322";
  lastRegist: string = "12/09/2020 | 12:25";
  cardStatus: Boolean = true;
  cardStatusColor: string = "label-success"
  urlImage : string = "assets/media/users/1212.jpg";
  entitystate:string = "activo" 

  cards: CardModel[];
  entities: EntityModel[];

  constructor(private layoutConfigService: LayoutConfigService, private cardService: CardService, private cardsService: CardsService, private entityService: EntityService) {
    super();

    
  }

  ngOnInit() {
  /*   this._docSub = this.cardService.notification.subscribe(data => {
      console.log('event', data);
 */
      // save uuid to input
  //  });

    console.log('Get cards');
    this.cardsService.getCards().subscribe((data: any) => {
      console.log('cards', data);
      this.cards = data.cards;
         
       data.cards.forEach(cards => {
        const c = {...cards};

        c.cardStatusColor = "label-success";

        this.cards.push(c);
      });

    });

    console.log('Get entities');
    this.entityService.getEntity().subscribe((data: any) => {
      console.log('entities', data);

      this.entities = [];
      data.entities.forEach(entity => {
        const e = {...entity};

        // TODO: fill additional props

        this.entities.push(e);
      });
    });
  }




  
  


}
