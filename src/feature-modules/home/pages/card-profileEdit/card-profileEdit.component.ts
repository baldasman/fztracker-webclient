import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Forms, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { HomeModule } from '../../home.module';
import { ToastrService } from 'ngx-toastr';
import { EntityService } from '@core-modules/core/services/entity.service';
import { FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-card-profileEdit',
  templateUrl: './card-profileEdit.component.html',
  styleUrls: ['./card-profileEdit.component.scss']
})
export class CardProfileEditComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {
  
  
  entitySearchform: FormGroup;
  get fes() { return this.entitySearchform.controls; }

  addentityform: FormGroup;
  get fac() { return this.addentityform.controls; }
  
  
  
  @Input() cssClasses = '';
  
  title = 'appBootstrap';
  model;
  model2;
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
  dynamicArray: Array<HomeModule> = [];  
  newDynamic: any = {}; 
 



  private _docSub: Subscription;

  constructor(private layoutConfigService: LayoutConfigService, private entityService: EntityService, private cardService: CardService, private toastr: ToastrService) {
    super();

  /*   if (this.cardNumber == "" ) {
      this.btnstatus = "active";
    
    } 
    else {
      this.btnstatus = "disabled";
    } */
    this.entitySearchform = this.formBuilder.group({
      findnii: [null, Validators.required]
    });

    this.addentityform = this.formBuilder.group({
      entitySerial: [null, Validators.required],
      entityFirstName: [null, Validators.required],
      entityLastName: [null, Validators.required],
      entityRank: [null, Validators.required],
      entityClass: [null, Validators.required],
      entityUnit: [null, Validators.required],
      entityPolo: [null, Validators.required],

    });
 



  }

  ngOnInit(): void {  
    this.newDynamic = {name: "", email: "",phone:""};  
    this.dynamicArray.push(this.newDynamic); 
 
    

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






    addRow() {    
      this.newDynamic = {card: "", type: "",uid:"",addcards:"",statuscard:""};  
        this.dynamicArray.push(this.newDynamic);  
        this.toastr.success('Novo registo Adicionado com sucesso', 'Novo Registo');  
        console.log(this.dynamicArray);  
        return true;  
    }  
    
    deleteRow(index) {  
        if(this.dynamicArray.length ==1) {  
          this.toastr.error("Não podes apagar uma linha Vazia", 'Atenção');  
            return false;  
        } else {  
            this.dynamicArray.splice(index, 1);  
            this.toastr.warning('Registao apagado com sucesso', 'Apagar Registo');  
            return true;  
        }  
    }









}
