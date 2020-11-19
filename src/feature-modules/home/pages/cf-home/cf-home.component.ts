import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';









@Component({
  selector: 'app-cf-home',
  templateUrl: './cf-home.component.html',
  styleUrls: ['./cf-home.component.scss']
})
export class CfHomeComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
  
  
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
  urlImage : string = "assets/media/polos/cfhome.jpg";
  name: string = "Conceição Silva";
  rankClass: string = "Civil";
  totalRegistos: number = 300;
  cardNumber: string = "M0001";
  cardUid: string = "US12324235322";
  addDate: string = "17/01/2020";
  cardType: string = "Civil";
  lastRegistDate: string = "12/09/2020";
  lastRegistHora: string = "10:22";
  cardStatus: string = "Entrou";
  cardStatusColor: string = "label-success";
  militaresCf:number = 890;
  militaresForaCf:number = 200;

  militaresCfAlf:number = 700;
  militaresForaCfAlf:number = 150;

  militaresCfEf:number = 290;
  militaresForaCfEf:number = 50;

  alunosCivisCfAlf:number = 20;
  alunosCivisCfEf:number = 200;

  visitasCfAlf:number = 18;
  visitasCfEf:number = 10;
  
  

  private _docSub: Subscription;

  constructor(private layoutConfigService: LayoutConfigService, private cardService: CardService,) {
    super();
    this.fontFamily = this.layoutConfigService.getConfig('js.fontFamily');
    this.colorsGrayGray500 = this.layoutConfigService.getConfig('js.colors.gray.gray500');
    this.colorsGrayGray200 = this.layoutConfigService.getConfig('js.colors.gray.gray200');
    this.colorsGrayGray300 = this.layoutConfigService.getConfig('js.colors.gray.gray300');
    this.colorsThemeBaseDanger = this.layoutConfigService.getConfig('js.colors.theme.base.danger');
    this.colorsThemeBasePrimary = this.layoutConfigService.getConfig('js.colors.theme.base.primary');
    this.colorsThemeLightPrimary = this.layoutConfigService.getConfig('js.colors.theme.light.primary');
 
    
  }

  ngOnInit(){  
    
 
    this.chartOptions6 = this.getChartOptions6();

  }

  getChartOptions6() {
    return {
        series: [
          {
            name: "CF-ALF",
            type: "column",
            data: [100, 88, 108, 110, 122, 214, 190, ]
          },
          {
            name: "CF-EF",
            type: "column",
            data: [90, 80, 150, 120, 130, 200, 200,  ]
          }
        ],
        chart: {
          height: 200,
          type: "line"
        
         
        },

        toolbar: {
          show: false
        },

        stroke: {
          width: [0, 4]
        },
        title: {
          text: "Corpo de Fuzileiros"
        },
        dataLabels: {
          enabled: false,
          enabledOnSeries: []
        },
        labels: [
          "01 Nov 2020",
          "02 Nov 2020",
          "03 Nov 2020",
          "04 Nov 2020",
          "05 Nov 2020",
          "06 Nov 2020",
          "07 Nov 2020",
          
      
  
        ],
        xaxis: {
          type: "datetime"
        },
        yaxis: [
          {
            title: {
              text: "Numero de Estradas"
            }
          },
       
        ]
      };
    };






    Find() { console.log(this.model)}




   
    
    








}
