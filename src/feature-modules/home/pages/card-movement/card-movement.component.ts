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
import { EnvironmentStore } from '@core-modules/stores';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-card-movement',
  templateUrl: './card-movement.component.html',
  styleUrls: ['./card-movement.component.scss']
})
export class CardMovementComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {

  //exemplo para teste, será preciso API para ir buscar este conteudo.
  MovimentsDay: Date = new Date();
  cardStatusColor: string = "label-success"
  totalRegistos: number = 300;
  from;
  to;
  local: string = null;
  findnii: string = "";
  placeholherNii: string = "pesquisa por NII";
  MovementSearchform: FormGroup;
  toDate;
  fromDate;
  public paginaAtual = 1;
  itemsPerPage = 15;
  term;

  place = "Todos";
  places = [];


  get fes() { return this.MovementSearchform.controls; }

  cards: CardModel[];
  movements: MovementModel[];

  private _docSub: Subscription;

  constructor(private toastr: ToastrService, private environmentStore: EnvironmentStore, private layoutConfigService: LayoutConfigService, private movementService: MovementsService, private cardsService: CardsService) {
    super();
    this.places = this.environmentStore.ENV.LOCAIS;

    this.MovementSearchform = this.formBuilder.group({
      findnii: [null, null]
    });

  }




  ngOnInit() {

    console.log('home');

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
    const todayDate = (year + "-" + month + "-" + day);


    if (this.from == undefined && this.to == undefined && this.fes.findnii.value == null) {
      console.log("testes ao log")
      this.fromDate = todayDate;
      this.toDate = todayDate;
      console.log('today', todayDate);

    }

    if (this.from == undefined && this.to == undefined && this.fes.findnii.value != null) {

      var month2 = (month - 1);
      var year2 = year;
      if ((month2) == 0) {
        month2 = 12, year2 = (year - 1);
      };

      var oldDate = ((year2 + "-" + month2 + "-" + day));
      this.fromDate = oldDate;
      this.toDate = todayDate;

    }
   
  


    if (this.from != undefined && this.to != undefined) {
      this.fromDate = `${this.from.year}-${this.from.month}-${this.from.day}`;
      this.toDate = `${this.to.year}-${this.to.month}-${this.to.day}`;
      console.log('search', this.fes.findnii.value, this.from, this.to);
    }
    var dateFirst = new Date(this.fromDate);
    var dateSecond = new Date(this.toDate);
    var timeDiff = Math.abs(dateSecond.getTime() - dateFirst.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays < 90) {


      console.log('teste a movimentos', this.fes.findnii.value, this.from, this.to, this.local);
      this.movementService.getMovements(this.fes.findnii.value, this.fromDate, this.toDate, this.local).subscribe((data: any) => {
        if (data.movements) {
          this.movements = data.movements;

        }
      });


    } else {
      this.toastr.error("intrevalo de pesquisa não pode ser superior a 90 dias", 'Atenção');
    }


  }

  selectChangeHandler(event: any) {
    //altera o local

    if (event.target.value == "Todos") { this.local = null }
    else this.local = event.target.value;

  }


  absoluteIndex(indexOnPage: number): number {


    return this.itemsPerPage * (this.paginaAtual - 1) + indexOnPage;
  }

  Abc(position) {
    var pos = ((this.itemsPerPage * (this.paginaAtual - 1)) + (position));
    Swal.fire({
      imageUrl: `assets/media/users/${this.movements[pos].entitySerial}.bmp`,
      imageAlt: 'Sem foto'
    })

  }







}


