import { Component, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { CardModel } from '@core-modules/core/models/card.model';
import { CardsService } from '@core-modules/core/services/cards.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent
  extends Mixin(Core, Animations, Stores)
  implements OnInit, OnDestroy
{
  totalRegistos: number = 0;
  cards: CardModel[];

  constructor(private cardsService: CardsService) {
    super();
  }

  ngOnInit() {
    this.cardsService.getCards().subscribe((data: any) => {
      this.cards = [];

      data.cards.forEach((cards) => {
        const c = { ...cards };

        c.cardStatusColor = 'label-success';
        this.cards.push(c);
      });

      this.totalRegistos = this.cards.length;
    });
  }
}
