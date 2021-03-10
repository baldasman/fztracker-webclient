import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Animations, Core, Forms, Mixin, Stores } from '@app/base';
import { CardService } from '@core-modules/core/services/card.service';
import { EntityService } from '@core-modules/core/services/entity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-foto-test',
  templateUrl: './foto-test.component.html',
  styleUrls: ['./foto-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FotoTestComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {


  entitySearchform: FormGroup;
  get fes() { return this.entitySearchform.controls; }

  assignCardform: FormGroup;
  get fac() { return this.assignCardform.controls; }

  //@Input() cssClasses = '';
  findnii: string = "";
  name: string;
  rankClass: string;
  urlImage: string = "assets/media/users/fz.png";
  cardNumber: string;
  cardType: string = "";
  cardStatus: string = "";
  cardOwner: string = "";
  color: string = "";
  placeholherNii: string;
  checked: boolean = false;
  isSwitchedOn = false;
  hasCard = false;
  hasError = false;

  private _docSub: Subscription;

  constructor(private cardService: CardService, private entityService: EntityService, private cdr: ChangeDetectorRef) {
    super();

    this.entitySearchform = this.formBuilder.group({
      findnii: [null, null]
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

      console.log('find',data);

      const entity = data;
      this.name = entity.name;
      this.urlImage = `assets/media/users/${entity.serial}.bmp`;
     this.fac.cardNumber.setValue(entity.cardNumber);
      this.hasCard = (entity.cardNumber || '').length > 0;

      if (this.hasCard) {
        this.fac.cardNumber.disable();
        this.cardStatus = "Cartão Atribuído";
      } else {
        this.fac.cardNumber.enable();
        this.cardStatus = "Sem cartao não Atribuido";
      }

      this.cdr.detectChanges();


    }, (error)=> {
      this.clearEntity();
      

      console.log(error);
    });
  }

 

  linkCard() {
    this.hasError = false;

    // link da entidader ao cartao 
    this.entityService.assignCard(this.fes.findnii.value, this.fac.cardNumber.value).subscribe((data: any) => {
      this.cardStatus = 'Cartão atribuído com sucesso!';
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


  private clearEntity() {
    this.name = '';
    this.urlImage = 'assets/media/users/desc.bmp';
    this.rankClass = '';
    this.fac.cardNumber.setValue('');

    this.fac.cardNumber.enable();
    this.hasCard = false;
    this.cardStatus = "";

    this.cdr.detectChanges();
  }
}
