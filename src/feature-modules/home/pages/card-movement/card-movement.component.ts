import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Forms, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardsService } from '@core-modules/core/services/cards.service';
import { CardModel } from '@core-modules/core/models/card.model';
import { MovementModel } from '@core-modules/core/models/movement.model';
import { FormGroup, Validators } from '@angular/forms';
import { EntityService } from '@core-modules/core/services/entity.service';
import { MovementsService } from '@core-modules/core/services/movements.service';
import { dateHourMinFormat } from '@core-modules/core/models/dates-helper.component';
import { data } from 'jquery';

@Component({
  selector: 'app-card-movement',
  templateUrl: './card-movement.component.html',
  styleUrls: ['./card-movement.component.scss']
})
export class  CardMovementComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {
 
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
  from;
  to;
  findnii: string = "";
  placeholherNii: string = "pesquisa por NII";
  MovementSearchform: FormGroup;
  toDate;
  fromDate;
 
  get fes() { return this.MovementSearchform.controls; }
  
  cards: CardModel[];
  movements: MovementModel[];

  private _docSub: Subscription;

  constructor(private layoutConfigService: LayoutConfigService, private movementService: MovementsService, private cardsService: CardsService) {
    super();

    this.MovementSearchform = this.formBuilder.group({
      findnii: [null, null]
    });

  }


 

  ngOnInit() {


    console.log('Get movements');
    this.movementService.getMovements().subscribe((data: any) => {
      console.log('movements', data);

      this.movements = data.movements;
    /*   data.movements.forEach(movement => {
        const e = {...movement};

        

        this.movements.push(e);
      }); */
    });


  }
   searchMovement() {


    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    const todayDate = (year+"-"+month+"-"+day);

    
    
 
    if (this.from == undefined && this.to == undefined && this.fes.findnii.value == null ) {console.log("testes ao log")
    this.fromDate = todayDate;
    this.toDate = todayDate;
    console.log('today',todayDate );
  
   }

   if (this.from == undefined && this.to == undefined && this.fes.findnii.value != null ) {console.log("testes ao log")
   var month2 = month;
    if ((month2 -1 ) == 0)
        {month2 = 12}

  var todayDatebefore = ((year+"-"+month2+"-"+day));

  this.fromDate = todayDatebefore;
  this.toDate = todayDate;
  console.log('datas', todayDatebefore, todayDate)
  }

   if (this.from != undefined && this.to != undefined ) {
   this.fromDate =`${this.from.year}-${this.from.month}-${this.from.day}`;
   this.toDate =`${this.to.year}-${this.to.month}-${this.to.day}`;
   console.log('search', this.fes.findnii.value, this.from, this.to);
  }

  this.movementService.getMovements(this.fes.findnii.value, this.fromDate, this.toDate).subscribe((data: any) => {
    if (data.movements) {
      this.movements = data.movements;
    
    }
  });
} 
 


}


