import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Animations, Core, Forms, Mixin, Stores } from '@app/base';
import { CardService } from '@core-modules/core/services/card.service';
import { EntityService } from '@core-modules/core/services/entity.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HomeModule } from '../../home.module';

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEntityComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {


  entitySearchform: FormGroup;
  get fes() { return this.entitySearchform.controls; }

  addentityform: FormGroup;
  get fac() { return this.addentityform.controls; }

  //@Input() cssClasses = '';
  findnii: string = "";
  entityPolo: string;
  rankClass: string;
  urlImage: string = "assets/media/users/desc.bmp";
  entitySerial: string;
  cardType: string = "";
  entityFirstName: string = "";
  entityLastName: string = "";
  entityRank: string = "";
  entityClass: string = "";
  entityUnit: string = "";
  checked: boolean = false;
  isSwitchedOn = false;
  cardNumber;
  dynamicArray: Array<HomeModule> = [];  
  newDynamic: any = {}; 

  private _docSub: Subscription;

  constructor(private cardService: CardService, private entityService: EntityService,  private toastr: ToastrService, private cdr: ChangeDetectorRef) {
    super();

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
    this.entityService.getEntity({ serial: this.fes.findnii.value }).subscribe((data: any) => {
      if (data.entities && data.entities.length > 0) {
        const entity = data.entities[0];
        this.entityFirstName = entity.permanent.name; // API - Devolve Entity name
       // this.urlImage = `assets/media/users/${entity.permanent.serial}.bmp`;
        this.entityRank = `${entity.nopermanent.rank} ${entity.permanent.class}`;
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
  /*   if (this.cardOwner == "") {
      this.cardStatus = "Cartao não Atribuido";
      this.color = "PaleGreen";
    }
  } */

};
LinkCard(){};


NounCard() {};

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