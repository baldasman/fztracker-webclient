import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, FormGroup, Forms, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { MovementsService } from '@core-modules/core/services/movements.service';
import { MovementModel } from '@core-modules/core/models/movement.model';
import { ToastrService } from 'ngx-toastr';
import {Howl} from 'howler';
import { EnvironmentStore } from '@core-modules/stores';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-armasDViewer',
  templateUrl: './card-armasDViewer.component.html',
  styleUrls: ['./card-armasDViewer.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardArmasDViewerComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {
  

  MovimentsDay: Date = new Date(); 
  cardStatusColor: string = "label-success"
  namePhoto: string = "";
  inOut: string = "";
  model;
  model2;
  fromDate;
  toDate;
  local: string ="Cf-ArmasD";
  MovementSearchform: FormGroup;
  movements: MovementModel[];
  foto: string = "assets/media/default.bmp";
  public paginaAtual = 1;
  itemsPerPage = 15;

  private _docSub: Subscription;
  get fes() { return this.MovementSearchform.controls; }
 
 

  place  ="Cf-ArmasD";
  places = [];


  constructor( private environmentStore: EnvironmentStore,private cardService: CardService, private layoutConfigService: LayoutConfigService, private movementService: MovementsService, private toastr: ToastrService) {
    super();
    this.places = this.environmentStore.ENV.LOCAIS;

    this.MovementSearchform = this.formBuilder.group({
      findnii: [null, null]
    });
    
  }

  ngOnInit() {

    this.movementService.getMovements(this.fes.findnii.value, this.fromDate, this.toDate, "Cf-ArmasD").subscribe((data: any) => {
      console.log('movements', data);
     

      this.movements = data.movements;

            });

    this._docSub = this.cardService.notification.subscribe(movement => {
      console.log('movement2', movement);
      
    
    // procura a fotografia do militar na DB
     if (movement.movement.location == this.local) {
     this.foto = `assets/media/users/${movement.entity.serial}.bmp`;
      this.namePhoto = `${movement.movement.entityName} `;
      
              this.movementService.getMovements(this.fes.findnii.value, this.fromDate, this.toDate, this.local).subscribe((data: any) => {       
              this.movements = data.movements;
              
              //impreime no ecra informação de in/out
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
