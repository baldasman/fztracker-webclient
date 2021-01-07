import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardsService } from '@core-modules/core/services/cards.service';
import { CardModel } from '@core-modules/core/models/card.model';
import { MovementModel } from '@core-modules/core/models/movement.model';
import { FormGroup, Validators } from '@angular/forms';
import { EntityService } from '@core-modules/core/services/entity.service';
import { MovementsService } from '@core-modules/core/services/movements.service';

@Component({
  selector: 'app-card-movement',
  templateUrl: './card-movement.component.html',
  styleUrls: ['./card-movement.component.scss']
})
export class  CardMovementComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
 
  //exemplo para teste, será preciso API para ir buscar este conteudo.
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
  findnii: string = "";
  MovementSearchform: FormGroup;
  get fes() { return this.MovementSearchform.controls; }
  
  cards: CardModel[];
  movements: MovementModel[];

  private _docSub: Subscription;

  constructor(private layoutConfigService: LayoutConfigService, private movementService: MovementsService, private cardsService: CardsService) {
    super();

  }

 

  ngOnInit() {


    console.log('Get movements');
    this.movementService.getMovements().subscribe((data: any) => {
      console.log('movements', data);

      this.movements = [];
      data.movements.forEach(movement => {
        const e = {...movement};

        

        this.movements.push(e);
      });
    });


  }
   searchMovement() {

  this.movementService.getMovements().subscribe((data: any) => {
    if (data.movements && data.movements.length > 0) {
      const movement = data.movements[0];
    
    }
  });
} 
 


}


