import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Animations, Core, Forms, Mixin, Stores } from '@app/base';
import { CardService } from '@core-modules/core/services/card.service';
import { EntityService } from '@core-modules/core/services/entity.service';
import { Subscription } from 'rxjs';
import { GunsService } from '@core-modules/core/services/guns.service';
import { GunsModel } from '@core-modules/core/models/guns.model';
import { Alert } from 'selenium-webdriver';
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-attach-gun',
  templateUrl: './attach-gun.component.html',
  styleUrls: ['./attach-gun.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachGunComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {


  entitySearchform: FormGroup;
  get fes() { return this.entitySearchform.controls; }

  assignCardform: FormGroup;
  get fac() { return this.assignCardform.controls; }

  gunsSearchform: FormGroup;
  get fat() { return this.gunsSearchform.controls; }

  //@Input() cssClasses = '';
  findnii: string = "";
  findgun: string = "";
  findarmer: string = "";
  name: string;
  email: string;
  urlImage: string = "assets/media/users/fz.png";
  cardNumber: string;
  cardStatus: string;
  unit: string = "";
  stat: string = "";
  cardOwner: string = "";
  color: string = "";
  placeholherNii: string;
  placeholhergun: string = "insira número do armeiro";
  checked: boolean = false;
  isSwitchedOn = false;
  hasCard = false;
  hasError = false;
  armeiro: string = "";
  g1: string = "";
  g2: string = "";
  g3: string = "";
  g4: string = "";
  g5: string = "";
  g6: string = "";
  g1Name: string = "";
  g2Name: string = "";
  g3Name: string = "";
  g4Name: string = "";
  g5Name: string = "";
  g6Name: string = "";

  private _docSub: Subscription;

  constructor(private cardService: CardService, private gunsService: GunsService, private entityService: EntityService, private cdr: ChangeDetectorRef) {
    super();

    this.entitySearchform = this.formBuilder.group({
      findnii: [null, null]
    });

    this.gunsSearchform = this.formBuilder.group({
      findarmer: [null, null]
    });

    this.assignCardform = this.formBuilder.group({
      cardNumber: [null, Validators.required]
    });

    this.placeholherNii = "insira NII Válido";
  }


  ngOnInit() {
    this._docSub = this.cardService.notification.subscribe(movement => {
      console.log('movement', movement);

      // Filter eventes by location
      if (movement.location !== 'LOCAL') {
        console.log('discard!!!');
      }
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

    if ((this.fes.findnii.value || '').trim().length === 0) {
      this.clearEntity();
      return;
    }

    this.hasError = false;

    // Call api

    this.entityService.findEntity(this.fes.findnii.value).subscribe((data: any) => {

      console.log('find', data);

      const entity = data;

      var temp = entity.unit.split(",");
      var correct = temp[2];
      var correctUnit = correct.split("=");
      this.unit = correctUnit[1];

      this.name = entity.name;
      this.email = entity.email;
      this.stat = entity.type;
      this.armeiro = "  Sem Armeiro";
      this.cardNumber = entity.cardNumber;
      this.urlImage = `assets/media/users/${entity.serial}.bmp`;
      this.fac.cardNumber.setValue(entity.cardNumber);
      this.hasCard = (entity.cardNumber || '').length > 0;

      if (this.hasCard) {
        this.fac.cardNumber.disable();
        this.cardStatus = " Armeiro Atribuído";
      } else {
        this.fac.cardNumber.enable();
        this.cardStatus = " Sem Armeiro Atribuido";
      }

      this.cdr.detectChanges();


    }, (error) => {
      this.clearEntity();


      console.log(error);
    });


  }

  WaitCard() {
    // API - se cartao lido, devolve o numero de cartao (this.cardNumber) e Tipo de Cartao (cardType)
    // se cartao lido, atera o findNum(), preenchendo todos os campos

  }

  linkCard() {
    this.hasError = false;

    // link da entidader ao cartao 
    this.entityService.assignCard(this.fes.findnii.value, this.fac.cardNumber.value).subscribe((data: any) => {
      this.cardStatus = 'Armeiro atribuído com sucesso!';
      this.fac.cardNumber.disable();
      this.hasCard = true;
      this.cdr.detectChanges();
    }, (e) => {
      console.log(e);
      this.cardStatus = e.error.resultMessage || e.error.error;
      this.fac.cardNumber.enable();
      this.hasCard = false;
      this.hasError = true;
      this.cdr.detectChanges();
    });
  }

  removeCard() {
    this.hasError = false;

    // desasocia o cartao da entidade 
    this.entityService.removeCard(this.fes.findnii.value).subscribe((data: any) => {
      this.cardStatus = 'Armeiro removido com sucesso!';
      this.fac.cardNumber.setValue('');
      this.fac.cardNumber.enable();
      this.hasCard = false;
      this.cdr.detectChanges();
    }, (error) => {
      this.cardStatus = error.error.data.error;
      this.fac.cardNumber.enable();
      this.hasCard = true;
      this.hasError = true;
      this.cdr.detectChanges();
    });
  }

  private clearEntity() {
    this.name = '';
    this.urlImage = 'assets/media/users/desc.bmp';
    this.email = "";
    this.unit = "";
    this.cardNumber = "";

    this.fac.cardNumber.setValue('');

    this.fac.cardNumber.enable();
    this.hasCard = false;
    this.cardStatus = "";

    this.cdr.detectChanges();
  }


  searchArmer() {




    console.log("searchArmer | findarmer =" + this.fat.findarmer.value);

    // if (this.fes.findnii.value == null) {
    //   return;
    // }



    this.hasError = false;


    //test gun service in html /armar
    this.gunsService.getAllArmerGuns(this.fat.findarmer.value).subscribe((data: any) => {
      console.log('get all guns', data);

      this.g1 = "";
      this.g2 = "";
      this.g3 = "";
      this.g4 = "";
      this.g5 = "";
      this.g6 = "";
      this.g1Name = "";
      this.g2Name = "";
      this.g3Name = "";
      this.g4Name = "";
      this.g5Name = "";
      this.g6Name = "";
      this.cdr.detectChanges();

      const armer = data.armer;

      if (armer == null) {

        Swal.fire({
          icon: 'error',
          title: 'Armeiro vazio/inexistente'
        });
        return
      }
      console.log("teste ao console", armer.ArmeiroId);

      console.log("nome", armer.guns[0].name, "serial", armer.guns[0].serial);


      if (armer.guns[0] !== 'undefined') {
        this.g1 = armer.guns[0].serial;
        this.g1Name = armer.guns[0].name;

      }

      if (typeof armer.guns[1] !== 'undefined') {
        this.g2 = armer.guns[1].serial;
        this.g2Name = armer.guns[1].name;

      }
      if (typeof armer.guns[2] !== 'undefined') {
        this.g3 = armer.guns[2].serial;
        this.g3Name = armer.guns[2].name;

      }
      if (typeof armer.guns[3] !== 'undefined') {
        this.g4 = armer.guns[3].serial;
        this.g4Name = armer.guns[3].name;

      }
      if (typeof armer.guns[4] !== 'undefined') {
        this.g5 = armer.guns[4].serial;
        this.g5Name = armer.guns[4].name;

      }
      if (typeof armer.guns[5] !== 'undefined') {
        this.g6 = armer.guns[5].serial;
        this.g6Name = armer.guns[5].name;
      }


      this.armeiro = armer.ArmeiroId;
      this.cdr.detectChanges();
    }, (error) => {
      console.log(error);
    });
  }
}
