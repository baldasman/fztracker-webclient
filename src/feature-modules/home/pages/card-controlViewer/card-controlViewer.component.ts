import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, FormGroup, Forms, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { MovementsService } from '@core-modules/core/services/movements.service';
import { MovementModel } from '@core-modules/core/models/movement.model';
import { ToastrService } from 'ngx-toastr';
import {Howl} from 'howler';
import { EntityListComponent } from '../entity-list/entity-list.component';
import { EntityService } from '@core-modules/core/services/entity.service';
import { EnvironmentStore } from '@core-modules/stores';


@Component({
  selector: 'app-card-controlViewer',
  templateUrl: './card-controlViewer.component.html',
  styleUrls: ['./card-controlViewer.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardControlViewerComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {
  

  MovimentsDay: Date = new Date(); 
  cardStatusColor: string = "label-success"
  namePhoto: string = "";
  inOut: string = "";
  model;
  model2;
  fromDate;
  toDate;
  local: string =null;
  MovementSearchform: FormGroup;
  movements: MovementModel[];
  foto: string = "assets/media/default.bmp";

  private _docSub: Subscription;
  get fes() { return this.MovementSearchform.controls; }
 
 

  place  ="Todos";
  places = [];


  constructor( private environmentStore: EnvironmentStore,private cardService: CardService, private layoutConfigService: LayoutConfigService, private movementService: MovementsService, private toastr: ToastrService) {
    super();
    this.places = this.environmentStore.ENV.LOCAIS;

    this.MovementSearchform = this.formBuilder.group({
      findnii: [null, null]
    });
    
  }

  ngOnInit() {

    this.movementService.getMovements().subscribe((data: any) => {
      console.log('movements', data);
     

      this.movements = data.movements;

            });

    this._docSub = this.cardService.notification.subscribe(movement => {
      console.log('movement', movement);
      
     if (movement.movement.location == this.local ||  this.local == null) {
     this.foto = `assets/media/users/${movement.entity.permanent.serial}.bmp`;
      this.namePhoto = `${movement.movement.entityName} `;
      
              this.movementService.getMovements().subscribe((data: any) => {       
              this.movements = data.movements;
              
              
                if (movement.movement.inOut == true) {  
                  this.toastr.success('Cartão autorizado');
                      let sound = new Howl({
                          src: ['assets/media/in.wav']
                            });

                          sound.play()
                    } ;

                    if (movement.movement.inOut == false) { 
                      this.toastr.info('Cartão autorizado'); 
                      let sound = new Howl({
                          src: ['assets/media/out.wav']
                            });

                          sound.play()
                    } ;

                });
        }      
    });    
}




  selectChangeHandler (event: any) {

      if (event.target.value =="Todos"){ this.local  = null} 
      else this.local  = event.target.value;
      

        console.log('teste a movimentos', this.fes.findnii.value, this.fromDate, this.toDate, this.local);
        this.movementService.getMovements(this.fes.findnii.value, this.fromDate, this.toDate, this.local).subscribe((data: any) => {
              if (data.movements) {
                this.movements = data.movements;
              
              }
            });


      
      } 


}
