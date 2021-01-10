import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, FormGroup, Forms, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { MovementsService } from '@core-modules/core/services/movements.service';
import { MovementModel } from '@core-modules/core/models/movement.model';


@Component({
  selector: 'app-card-controlViewer',
  templateUrl: './card-controlViewer.component.html',
  styleUrls: ['./card-controlViewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardControlViewerComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {
  

  MovimentsDay: Date = new Date(); 
  cardStatusColor: string = "label-success"
  model;
  model2;
  fromDate;
  toDate;
  local: string =null;
  MovementSearchform: FormGroup;
  movements: MovementModel[];

  private _docSub: Subscription;
  get fes() { return this.MovementSearchform.controls; }
 
 

  place  ="Todos";
  places = ["Todos","LOCALX","CF-Escola"];


  constructor(private cardService: CardService, private layoutConfigService: LayoutConfigService, private movementService: MovementsService) {
    super();

    this.MovementSearchform = this.formBuilder.group({
      findnii: [null, null]
    });
    
  }

  ngOnInit() {
    this._docSub = this.cardService.notification.subscribe(movement => {
      console.log('movement', movement);

      // Filter eventes by location
    
       });
    

    this.movementService.getMovements().subscribe((data: any) => {
      console.log('movements', data);
     

      this.movements = data.movements;

      // save uuid to input
    });
 

}


selectChangeHandler (event: any) {
//altera o local
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
