import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';








@Component({
  selector: 'app-card-profileEdit',
  templateUrl: './card-profileEdit.component.html',
  styleUrls: ['./card-profileEdit.component.scss']
})
export class CardProfileEditComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
  
  
  title = 'appBootstrap';
  
  model;
  model2;


  @Input() cssClasses = '';

  chartOptions6: any = {};
  fontFamily = '';
  colorsGrayGray500 = '';
  colorsGrayGray200 = '';
  colorsGrayGray300 = '';
  colorsThemeBaseDanger = '';
  colorsThemeBasePrimary = '';
  colorsThemeLightPrimary = '';
  urlImage : string = "assets/media/users/1212.jpg";
  name: string = "Conceição Silva";
  rankClass: string = "Civil";
  totalRegistos: number = 300;
  cardNumber: string = "M001";
  cardUid: string = "US12324235322";
  cardRen: string = "";
  addDate: string = "17/01/2020";
  cardType: string = "Civil";
  lastRegistDate: string = "12/09/2020";
  lastRegistHora: string = "10:22";
  cardStatus: string = "Entrou";
  cardStatus2: string = "Estado do cartão";
  checked: boolean =false; 
  isSwitchedOn = false;
  btnstatus: string = "";
  btnblock: string = "";

 



  private _docSub: Subscription;

  constructor(private layoutConfigService: LayoutConfigService, private cardService: CardService) {
    super();

    if (this.cardNumber == "" ) {
      this.btnstatus = "active";
    
    } 
    else {
      this.btnstatus = "disabled";
    }
 



  }

  ngOnInit() {
    this._docSub = this.cardService.notification.subscribe(data => {
      console.log('event', data);

      // save uuid to input
    });
 

  }

 




    Find() { console.log(this.model)}


    NounCard(){

      // desasocia o cartao da entidade 
            
      var txt;
      var person = prompt("Motivo da eliminação do Cartão");
      if (person == null ) {
        txt = "User cancelled the prompt.";
      } else {
        txt = "Motivo " + person;
      }
      console.log(txt);
    }
          

  LinkCard(){

    // link da entidader ao cartao 
    console.log("add")

   
    
    
        }



    BlockCard(){

      var txt;
      var person = prompt("Motivo do Bloqueio");
      if (person == "") {
        alert("Motivo Obrigatório");
      } else {
        txt = "Motivo " + person;
      }
      console.log(txt);


    }


}
