import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';









@Component({
  selector: 'app-cfalf-home',
  templateUrl: './cfalf-home.component.html',
  styleUrls: ['./cfalf-home.component.scss']
})
export class CfAlfHomeComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
  
  
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

  alunosAlf:number = 20;
  alunosEf:number = 200;

  civisAlf:number = 20;
  civisEf:number = 30;
  
  visitasAlf:number = 18;
  visitasEf:number = 10;
  
  

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
          text: "Entradas por Dias"
         
        },
        dataLabels: {
          enabled: false,
          enabledOnSeries: []
        },
        labels: [
          "01 Nov ",
          "02 Nov ",
          "03 Nov ",
          "04 Nov ",
          "05 Nov ",
          "06 Nov ",
          "07 Nov ",
          
      
  
        ],
        xaxis: {
          type: "bar"
          
        
        }
        ,
        yaxis: [
          {
            title: {
              text: "Número de Entradas"
            }
            
          },
       
        ]
      };
    };






    Find() { console.log(this.model)}




   
    
    








}
