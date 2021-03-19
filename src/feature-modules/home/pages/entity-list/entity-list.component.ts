import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Forms, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { CardsService } from '@core-modules/core/services/cards.service';
import { CardModel } from '@core-modules/core/models/card.model';
import { uniqueId } from 'lodash';
import { EntityModel } from '@core-modules/core/models/entity.model';
import { EntityService } from '@core-modules/core/services/entity.service';
import { FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent extends Mixin(Core, Animations,Forms, Stores) implements OnInit, OnDestroy {
  
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
  placeholherNii:string;
  findnii: string = "";
  entitySearchform: FormGroup;
  entityType: string = "Militar";
  entityLocal: string = "ALF";
  get fes() { return this.entitySearchform.controls; }

  term;

  local: string = null;
  public paginaAtual = 1;
  itemsPerPage = 15;
  cards: CardModel[];
  entities: EntityModel[];
  entitiFoto:[];

  constructor(private layoutConfigService: LayoutConfigService, private cardService: CardService, private cardsService: CardsService, private entityService: EntityService) {
    super();

    this.entitySearchform = this.formBuilder.group({
      findnii: [null, Validators.required]
    });

    this.placeholherNii = "insira NII Válido";
    
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
    this.entityService.getEntity({}).subscribe((data: any) => {
      console.log('entities', data);
      
      
      this.entities = [];
      data.entities.forEach(entity => {
        const e = {...entity};

        // TODO: fill additional props

        this.entities.push(e);
      });
    });
  }


unit (unidade) {
 console.log('o valor da unidade é '+unidade);

  var temp = unidade.split(",");
      var correct = temp[2];
      var correctUnit = correct.split("=");
      this.unit =  correctUnit[1];
}



  searchEntity() {
    
    console.log("searchEntity | findnii =" + this.fes.findnii.value);

     var x = this.fes.findnii.value
     if (x.length  < 5 ) {
     
          Swal.fire({  
            icon: 'error',  
            title: 'NII Inválido' });  

          console.log("NII INVÁLIDO");
          return;
      }

    if (!this.entitySearchform.valid) {
      // this.hidePageLoader();
      this.fes.findnii.setErrors({ custom: 'Campo obrigatório' });
      this.formService.showErrors(this.entitySearchform);
      return;
    }


    // Call api
    this.entityService.getEntity({serial: this.fes.findnii.value}).subscribe((data: any) => {
      if (data.entities && data.entities.length > 0) {
        const entity = data.entities[0];
       
      }
    });
  }


  Abc(position) {



    var pos = ((this.itemsPerPage * (this.paginaAtual - 1)) + (position));
    Swal.fire({
      imageUrl: `assets/media/users/${this.entities[pos].serial}.bmp`,
      imageAlt: 'Sem foto'
    })

  }
  
  
  Abcd(myvalue) {
   console.log('a minha posição '+ myvalue);
    
  }



}
