import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Animations, Core, Forms, Mixin, Stores } from '@app/base';
import { environment } from '@app/config';
import { CardService } from '@core-modules/core/services/card.service';
import { EntityService } from '@core-modules/core/services/entity.service';
import { MovementsService } from '@core-modules/core/services/movements.service';
import { EnvironmentStore } from '@core-modules/stores';
import { Console } from 'console';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-manual',
  templateUrl: './card-manual.component.html',
  styleUrls: ['./card-manual.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class cardmanualComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {


  entitySearchform: FormGroup;
  get fes() { return this.entitySearchform.controls; }

  assignCardform: FormGroup;
  get fac() { return this.assignCardform.controls; }

  //@Input() cssClasses = '';
  findnii: string = "";
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
  checked: boolean = false;
  isSwitchedOn = false;
  hasCard = false;
  hasError = false;
  uid: string;
  place = "";
  places = [];

  private _docSub: Subscription;

  constructor(private environmentStore: EnvironmentStore, private cardService: CardService, private entityService: EntityService, private cdr: ChangeDetectorRef, private movementService: MovementsService) {
    super();

    this.places = this.environmentStore.ENV.UNINDADES;

    this.entitySearchform = this.formBuilder.group({
      findnii: [null, null],
      local: [],
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
    console.log("searchEntity | local =" + this.fes.local.value);

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
      this.uid = entity.cardId;
      this.urlImage = `assets/media/users/${entity.serial}.bmp`;
      this.fac.cardNumber.setValue(entity.cardNumber);
      this.hasCard = (entity.cardNumber || '').length > 0;

      if (this.hasCard) {
        this.fac.cardNumber.disable();
        this.cardStatus = "Cartão Atribuído";
      } else {
        this.fac.cardNumber.enable();
        this.cardStatus = "Sem cartao Atribuido";
      }

      this.cdr.detectChanges();


    }, (error) => {
      this.clearEntity();


      console.log(error);
    });


  }

  //FALTA CRIAR DROP PARA LOCAL DE ENTRADA 

  in(local) {

    const location = local;
    const cardId = this.uid;
    const manual = true;
    const inOut = true;
    const sensor = "web";



    this.movementService.addmovement(location, sensor, cardId, manual, inOut).subscribe(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });




  }

  out(local) {

    const location = local;
    const cardId = this.uid;
    const manual = true;
    const inOut = false;
    const sensor = "web";


    this.movementService.addmovement(location, sensor, cardId, manual, inOut).subscribe(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });




  }

  test(local) {
    var a = local

  }

  private clearEntity() {
    this.name = '';
    this.urlImage = 'assets/media/users/desc.bmp';
    this.email = "";
    this.unit = "";

    this.fac.cardNumber.setValue('');

    this.fac.cardNumber.enable();
    this.hasCard = false;
    this.cardStatus = "";

    this.cdr.detectChanges();
  }
}
