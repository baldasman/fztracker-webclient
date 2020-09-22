import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';


@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
  @Input() cssClasses = '';
 

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
