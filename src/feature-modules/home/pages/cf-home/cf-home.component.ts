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

import * as moment from 'moment';
import { AnalyticsService } from '@core-modules/core/services/analytics.service';

@Component({
  selector: 'app-cf-home',
  templateUrl: './cf-home.component.html',
  styleUrls: ['./cf-home.component.scss']
})
export class CfHomeComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {

  
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
  urlImage: string = "assets/media/polos/cfhome.jpg";
  totalRegistos: number = 300;
  cardStatusColor: string = "label-success";

  militaresCf: number = 890;
  militaresForaCf: number = 200;

  militaresCfAlf: number = 700;
  militaresForaCfAlf: number = 150;

  militaresCfEf: number = 290;
  militaresForaCfEf: number = 50;

 mealscf1:number = 20;
 mealscf2:number = 200;
 mealscf3:number = 80;

 cardsCfEf:number = 150;
 cardsCfAlf:number = 500;

 
  public paginaAtual = 1;
  itemsPerPage = 15;
  term;

  MovementSearchform: FormGroup;
  get fes() { return this.MovementSearchform.controls; }

  cards: CardModel[];
  movements: MovementModel[];

  private _docSub: Subscription;

  constructor(
    private layoutConfigService: LayoutConfigService, 
    private analyticsService: AnalyticsService, 
    private movementService: MovementsService,
  ) {
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
    /*
    this.analyticsService.getMovementsByDate(true, (new Date().toISOString())).subscribe(data => {
      console.log('onMovemetnsByDate', data);
    });
    */

    this.analyticsService.entitesCountByState(true).subscribe(data => {
      console.log('entitesCountByState', data);
    });


    this.chartOptions6 = this.getChartOptions6();


    this.movementService.getMovements(null, null, null, "CF-Escola").subscribe((data: any) => {
      if (data.movements) {
        this.movements = data.movements;
      
      }
    });
    
  }



  getChartOptions6() {
    const date = moment();



    return {
      series: [
        {
          name: "Entradas ALF",
          type: "column",
          data: [100, 88, 108, 110, 122, 214, 190,]
        },
        {
          name: "Entradas EF",
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
        moment(date).subtract("7", "days").format('DD-MMM'), 
        moment(date).subtract("6", "days").format('DD-MMM'),
        moment(date).subtract("5", "days").format('DD-MMM'), 
        moment(date).subtract("4", "days").format('DD-MMM'),
        moment(date).subtract("3", "days").format('DD-MMM'),
        moment(date).subtract("2", "days").format('DD-MMM'), 
        moment(date).subtract("1", "days").format('DD-MMM'),



      ],
      xaxis: {
        type: "bar"


      }
      ,
      yaxis: [
        {
          title: {
            text: "Número de Entradas CCF"
          }

        },

      ]
    };
  };






  Find() { console.log(this.model) }



  absoluteIndex(indexOnPage: number): number {


    return this.itemsPerPage * (this.paginaAtual - 1) + indexOnPage;
  }

  Abc(position) {
    var pos = ((this.itemsPerPage*(this.paginaAtual - 1))+(position));
    Swal.fire({
      imageUrl: `assets/media/users/${this.movements[pos].entitySerial}.bmp`,
      imageAlt: 'Sem foto'
    })

  }












}
