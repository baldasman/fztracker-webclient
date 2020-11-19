import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Animations, Core, Forms, Mixin, Stores } from '@app/base';
import { CardService } from '@core-modules/core/services/card.service';
import { EntityService } from '@core-modules/core/services/entity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attach-card',
  templateUrl: './attach-card.component.html',
  styleUrls: ['./attach-card.component.scss']
})
export class AttachCardComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {


  entitySearchform: FormGroup;
  get fes() { return this.entitySearchform.controls; }

  //@Input() cssClasses = '';
  findnii: string = "";
  name: string;
  rankClass: string;
  urlImage: string = "assets/media/users/teste1.jpg";
  cardNumber: string;
  cardType: string = "";
  cardStatus: string = "Status do Cartão ";
  cardOwner: string = "";
  color: string = "";
  placeholherNii: string;
  checked: boolean = false;
  isSwitchedOn = false;
  ;


  private _docSub: Subscription;

  constructor(private cardService: CardService, private entityService: EntityService) {
    super();

    this.entitySearchform = this.formBuilder.group({
      findnii: [null, Validators.required]
    });

    this.placeholherNii = "insira NII Válido";
  }


  ngOnInit() {
    this._docSub = this.cardService.notification.subscribe(data => {
      console.log('event', data);

      // save uuid to input
    });



  }


  onOff() {
    //console.log("checked");


  }

  searchEntity() {
    console.log("searchEntity | findnii =" + this.fes.findnii.value);

    // if (this.fes.findnii.value == null) {
    //   return;
    // }

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
        this.name = entity.permanent.name; // API - Devolve Entity name
        this.urlImage = `assets/media/users/${entity.permanent.serial}.bmp`;
        this.rankClass = `${entity.nopermanent.rank} ${entity.permanent.class}`;
        // this.cardNumber = "Numero do Cartão"; // API - Devolve cardNumber associado a esta entidade se nao existir devolve (this.cardOwner = "")
        // this.cardType = "teste de cardType"; // API - Devolve Cardtype
    
        // if (this.cardOwner == "") {
        //   this.cardStatus = "Cartao não Atribuido";
        //   this.color = "PaleGreen";
        // }
      }
    });
  }

  WaitCard() {
    // API - se cartao lido, devolve o numero de cartao (this.cardNumber) e Tipo de Cartao (cardType)
    // se cartao lido, atera o findNum(), preenchendo todos os campos
    if (this.cardOwner == "") {
      this.cardStatus = "Cartao não Atribuido";
      this.color = "PaleGreen";
    }
  }

  LinkCard() {
    // link da entidader ao cartao 

  }

  NounCard() {
    // desasocia o cartao da entidade 

  }
}
