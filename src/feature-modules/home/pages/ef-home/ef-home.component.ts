import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Forms, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { CardModel } from '@core-modules/core/models/card.model';
import { MovementModel } from '@core-modules/core/models/movement.model';
import { FormGroup, FormsModule } from '@angular/forms';
import { MovementsService } from '@core-modules/core/services/movements.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 








@Component({
  selector: 'app-ef-home',
  templateUrl: './ef-home.component.html',
  styleUrls: ['./ef-home.component.scss']
})
export class EfHomeComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {

  public paginaAtual = 1;
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
  urlImage: string = "assets/media/polos/efhome.jpg";
  totalRegistos: number = 300;
  cardStatusColor: string = "label-success";

  militaresCf: number = 890;
  militaresForaCf: number = 200;

  militaresCfAlf: number = 700;
  militaresForaCfAlf: number = 150;

  militaresCfEf: number = 290;
  militaresForaCfEf: number = 50;

  alunosAlf: number = 20;
  alunosEf: number = 200;

  civisAlf: number = 20;
  civisEf: number = 30;

  visitasAlf: number = 18;
  visitasEf: number = 10;

  MovementSearchform: FormGroup;
  get fes() { return this.MovementSearchform.controls; }

  cards: CardModel[];
  movements: MovementModel[];

  private _docSub: Subscription;

  constructor(private layoutConfigService: LayoutConfigService, private cardService: CardService, private movementService: MovementsService,) {
    super();
    this.fontFamily = this.layoutConfigService.getConfig('js.fontFamily');
    this.colorsGrayGray500 = this.layoutConfigService.getConfig('js.colors.gray.gray500');
    this.colorsGrayGray200 = this.layoutConfigService.getConfig('js.colors.gray.gray200');
    this.colorsGrayGray300 = this.layoutConfigService.getConfig('js.colors.gray.gray300');
    this.colorsThemeBaseDanger = this.layoutConfigService.getConfig('js.colors.theme.base.danger');
    this.colorsThemeBasePrimary = this.layoutConfigService.getConfig('js.colors.theme.base.primary');
    this.colorsThemeLightPrimary = this.layoutConfigService.getConfig('js.colors.theme.light.primary');


  }

  ngOnInit() {


    this.chartOptions6 = this.getChartOptions6();


    this.movementService.getMovements(null, null, null, "CF-Escola").subscribe((data: any) => {
      if (data.movements) {
        this.movements = data.movements;
      
      }
    });
    
  }



  getChartOptions6() {
    return {
      series: [
        {
          name: "Entradas",
          type: "column",
          data: [100, 88, 108, 110, 122, 214, 190,]
        },
        {
          name: "Saídas",
          type: "column",
          data: [90, 80, 150, 120, 130, 200, 200,]
        }
      ],
      chart: {
        height: 260,
        type: "line"


      },

      toolbar: {
        show: false
      },

      stroke: {
        width: [0, 4]
      },
      title: {
        text: "Militares últimos 7 Dias "

      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: []
      },
      labels: [
        "01 Fev ",
        "02 Fev ",
        "03 Fev ",
        "04 Fev ",
        "05 Fev ",
        "06 Fev ",
        "07 Fev ",



      ],
      xaxis: {
        type: "bar"


      }
      ,
      yaxis: [
        {
          title: {
            text: "Número de Entradas/Saídas"
          }

        },

      ]
    };
  };






  Find() { console.log(this.model) }



 











}
