import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Mixin, Core, Animations, Forms, Stores } from '@app/base';

import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';


@Component({
  selector: 'app-attach-card',
  templateUrl: './attach-card.component.html',
  styleUrls: ['./attach-card.component.scss']
})
export class AttachCardComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {

  
  form: FormGroup;
  get f() { return this.form.controls; }
  
  //@Input() cssClasses = '';
  public findnii : string ="";
  name : string;
  rankClass: string;
  urlImage : string = "assets/media/users/teste1.jpg";
  cardNumber: string;
  cardType: string = "";
  cardStatus : string = "Status do Cartão ";
  cardOwner: string = "";
  color: string = "";
;
  

  private _docSub: Subscription;

  constructor(private cardService: CardService) {
    super();

    this.form = this.formBuilder.group({
      findnii: [null, Validators.required]
    });
  }


  ngOnInit() {
    this._docSub = this.cardService.notification.subscribe(data => {
      console.log('event', data);

      // save uuid to input
    });
 
    

  }


  FindNum() {
    console.log("findnii =" + this.f.findnii.value);
    this.name = "teste"; // API - Devolve Entity name
    this.urlImage = "assets/media/users/teste1.jpg" ;// altera para foto cujo o nome é no {{NII}}.jpg
    this.rankClass = "rank e class"; //API - devolde o Rank e Classe
    this.cardNumber = "Numero do Cartão"; // API - Devolve cardNumber associado a esta entidade se nao existir devolve (this.cardOwner = "")
    this.cardType = "teste de cardType"; // API - Devolve Cardtype


    if (this.cardOwner == ""){
         this.cardStatus = "Cartao não Atribuido";
         this.color = "PaleGreen";

      }     

    if (!this.form.valid) {
      // this.hidePageLoader();
      this.f.findnii.setErrors({ custom: 'Campo obrigatório' });
      this.formService.showErrors(this.form);
      
      
      
      
      return;
    }
    
  }

  
  WaitCard() {
// API - se cartao lido, devolve o numero de cartao (this.cardNumber) e Tipo de Cartao (cardType)
// se cartao lido, atera o findNum(), preenchendo todos os campos
if (this.cardOwner == ""){
  this.cardStatus = "Cartao não Atribuido";
  this.color = "PaleGreen";
}


}

LinkCard(){

// link da entidader ao cartao 


    }



NounCard(){

// desasocia o cartao da entidade 

    }


}


