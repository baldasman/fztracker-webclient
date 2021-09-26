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
import { count } from 'rxjs/operators';
import { data } from 'jquery';
import { EntityService } from '@core-modules/core/services/entity.service';

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


  day1Graf: number;
  day2Graf: number;
  day3Graf: number;
  day4Graf: number;
  day5Graf: number;
  day6Graf: number;
  day7Graf: number = 0;

  private day7Series = [];
  private day7CallsCounter = 0;

  day8Graf: number;
  day9Graf: number;
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

  militaresCf: number = (890);
  militaresForaCf: number = 200;

  militaresCfAlf: number = 700;
  militaresForaCfAlf: number = 150;

  militaresCfEf: number = 290;
  militaresForaCfEf: number = 50;

  mealscf1: number = 0;
  mealscf2: number = 0;
  mealscf3: number = 0;

  cardsCfEf: number = 0;
  cardsCfAlf: number = 785;


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
    private cardService: CardService,
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

    
    this._docSub = this.cardService.notification.subscribe(movement => {
      console.log('movement', movement);
      
      console.log('movimento é ', movement.entity.inOut);

        if (movement.entity.inOut == true){
          this.militaresForaCf = (+this.militaresForaCf -1);
          this.militaresCf = (+this.militaresCf +1);
          console.log('militares IN', this.militaresForaCf, this.militaresCf );
          
          document.getElementById('milcf').innerHTML = this.militaresCf.toString();
        }
        if(movement.entity.inOut == false) {

          this.militaresForaCf = (+this.militaresForaCf +1);
          this.militaresCf = (+this.militaresCf -1);
          console.log('militares OUT ', this.militaresForaCf, this.militaresCf );

          document.getElementById('milcf').innerHTML = this.militaresCf.toString();
        }

   
      

      // Filter eventes by location
      if (movement.location !== 'LOCAL') {
        console.log('discard!!!');
      }
    });

    /*
    this.analyticsService.getMovementsByDate(true, (new Date().toISOString())).subscribe(data => {
      console.log('onMovemetnsByDate', data);
    });
    */




    this.analyticsService.entitesCountByState(true).subscribe(data => {
      console.log('contagar entidades in', data);

      let xx = Object.values(data);

      this.militaresCf = +xx;
      this.militaresCfAlf = +xx;
      this.militaresCfEf = 0;

      //console.log('entitesCountByState by tfuzo', xx[0]  );
    });




    this.analyticsService.entitesCountByState(false).subscribe(data => {
      console.log('contagar entidades out', data);


      let xx = Object.values(data);

      this.militaresForaCf = +xx;
      this.militaresForaCfAlf = +xx;
      this.militaresForaCfEf = 0;

    });






    this.chartOptions6 = this.getChartOptions6();


    this.movementService.getMovements(null, null, null, "Cf-Alfeite").subscribe((data: any) => {
      if (data.movements) {
        this.movements = data.movements;

      }
    });

  }


  entitys(){
    


  }



  getChartOptions6() {

    let day1 = moment().subtract("7", "days");
    let day2 = moment().subtract("6", "days");
    let day3 = moment().subtract("5", "days");
    let day4 = moment().subtract("4", "days");
    let day5 = moment().subtract("3", "days");
    let day6 = moment().subtract("2", "days");
    let day7 = moment().subtract("1", "days");

    // Antes de chamar todas, limpar
    this.day7Series = [];
    this.day7Series[0] = { data: [0, 0, 0, 0, 0, 0, 0] };
    this.day7Series[1] = { data: [0, 0, 0, 0, 0, 0, 0] };

    this.day7CallsCounter = 7;  // TODO:mudar para 7

    // 1 day
    this.analyticsService.getMovementsCountByDate(true, day1.toString(),).subscribe(data => {
      this.day7Series[0].data[0] = data.count;

      this.day7CallsCounter--;

      if (this.day7CallsCounter === 0) {
        this.update7DaysChart(this.day7Series);
      }
    });
    // 2 day
    this.analyticsService.getMovementsCountByDate(true, day2.toString(),).subscribe(data => {
      this.day7Series[0].data[1] = data.count;

      this.day7CallsCounter--;

      if (this.day7CallsCounter === 0) {
        this.update7DaysChart(this.day7Series);
      }
    });
    // 3 day
    this.analyticsService.getMovementsCountByDate(true, day3.toString(),).subscribe(data => {
      this.day7Series[0].data[2] = data.count;

      this.day7CallsCounter--;

      if (this.day7CallsCounter === 0) {
        this.update7DaysChart(this.day7Series);
      }
    });
    // 4 day
    this.analyticsService.getMovementsCountByDate(true, day4.toString(),).subscribe(data => {
      this.day7Series[0].data[3] = data.count;

      this.day7CallsCounter--;

      if (this.day7CallsCounter === 0) {
        this.update7DaysChart(this.day7Series);
      }
    });
    // 5 day
    this.analyticsService.getMovementsCountByDate(true, day5.toString(),).subscribe(data => {
      this.day7Series[0].data[4] = data.count;

      this.day7CallsCounter--;

      if (this.day7CallsCounter === 0) {
        this.update7DaysChart(this.day7Series);
      }
    });

    // 6 day
    this.analyticsService.getMovementsCountByDate(true, day6.toString(),).subscribe(data => {
      this.day7Series[0].data[5] = data.count;

      this.day7CallsCounter--;

      if (this.day7CallsCounter === 0) {
        this.update7DaysChart(this.day7Series);
      }
    });
    // 7 day
    this.analyticsService.getMovementsCountByDate(true, day7.toString(),).subscribe(data => {
      this.day7Series[0].data[6] = data.count;

      this.day7CallsCounter--;

      if (this.day7CallsCounter === 0) {
        this.update7DaysChart(this.day7Series);
      }
    });




    return {
      series: [
        {
          name: "Entradas ALF",
          type: "column",
          data: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ]
        },
        {
          name: "Entradas EF",
          type: "column",
          data: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ]
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
        day1.format('DD-MMM'),
        day2.format('DD-MMM'),
        day3.format('DD-MMM'),
        day4.format('DD-MMM'),
        day5.format('DD-MMM'),
        day6.format('DD-MMM'),
        day7.format('DD-MMM'),



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
    var pos = ((this.itemsPerPage * (this.paginaAtual - 1)) + (position));
    Swal.fire({
      imageUrl: `assets/media/users/${this.movements[pos].entitySerial}.bmp`,
      imageAlt: 'Sem foto'
    })

  }






  private update7DaysChart(series: any[]): void {
    this.chartOptions6.series = series;
  }





}
