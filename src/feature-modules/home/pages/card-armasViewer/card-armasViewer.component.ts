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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-armasViewer',
  templateUrl: './card-armasViewer.component.html',
  styleUrls: ['./card-armasViewer.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardArmasViewerComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {
  

  MovimentsDay: Date = new Date(); 
  cardStatusColor: string = "label-success"
  namePhoto: string = "";
  inOut: string = "";
  model;
  model2;
  fromDate;
  toDate;
  local: string ="Cf-Armas";
  MovementSearchform: FormGroup;
  movements: MovementModel[];
  foto: string = "assets/media/default.bmp";
  public paginaAtual = 1;
  itemsPerPage = 15;

  private _docSub: Subscription;
  get fes() { return this.MovementSearchform.controls; }
 
 

  place  ="Cf-Armas";
  places = [];


  constructor( private environmentStore: EnvironmentStore,private cardService: CardService, private layoutConfigService: LayoutConfigService, private movementService: MovementsService, private toastr: ToastrService) {
    super();
    this.places = this.environmentStore.ENV.LOCAIS;

    this.MovementSearchform = this.formBuilder.group({
      findnii: [null, null]
    });
    
  }

  ngOnInit() {

    this.movementService.getMovements(this.fes.findnii.value, this.fromDate, this.toDate, "Cf-Armas").subscribe((data: any) => {
      console.log('movements', data);
     

      this.movements = data.movements;

            });

    this._docSub = this.cardService.notification.subscribe(movement => {
      console.log('movement2', movement);
      
/*{
    "movement": {
        "uid": "54aa37e9-854e-477b-a004-2c9770e4465c",
        "location": "Cf-Alfeite",
        "sensor": "Cf-Alf.CarIn",
        "cardId": "0438F61AE66C81",
        "manual": false,
        "inOut": true,
        "cardIdShort": "0438F6",
        "cardNumber": "M0183",
        "entitySerial": "9830401",
        "entityType": "QP - ACTIVO",
        "entityName": "SAJ FZ Moreira de Sousa",
        "movementDate": "2021-04-28T21:46:10.196Z"
    },
    "entity": {
        "inOut": true,
        "resources": [],
        "_id": "6048cd7017b1b429dc8e0b97",
        "lastMovementDate": "2021-04-28T21:46:10.196Z",
        "serial": "9830401",
        "state": "ACTIVE",
        "name": "SAJ FZ Moreira de Sousa",
        "unit": "CN=M9830401,OU=USERS,OU=CCF,OU=Marinha,DC=marinha,DC=pt",
        "type": "QP - ACTIVO",
        "email": "moreira.sousa@marinha.pt",
        "__v": 0,
        "cardId": "0438F61AE66C81",
        "cardNumber": "M0183"
    }
}*/



     

     if (movement.movement.location == this.local) {
     this.foto = `assets/media/users/${movement.entity.serial}.bmp`;
      this.namePhoto = `${movement.movement.entityName} `;
      
              this.movementService.getMovements(this.fes.findnii.value, this.fromDate, this.toDate, this.local).subscribe((data: any) => {       
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



      Abc(position) {
        var pos = ((this.itemsPerPage * (this.paginaAtual - 1)) + (position));
        Swal.fire({
          imageUrl: `assets/media/users/${this.movements[pos].entitySerial}.bmp`,
          imageAlt: 'Sem foto'
        })
    
      }



}
