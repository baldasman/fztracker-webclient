import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Forms, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EnvironmentStore } from '@core-modules/stores';
import { MovementsService } from '@core-modules/core/services/movements.service';
import { MovementModel } from '@core-modules/core/models/movement.model';









@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.scss']
})
export class CardProfileComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit, OnDestroy {
  
  
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
  profile:;
  urlImage : string = "assets/media/users/1212.jpg";
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
  serial: string;
  movements: MovementModel[];
  public paginaAtual = 1;
  private _docSub: Subscription;

  constructor(private movementService: MovementsService, private layoutConfigService: LayoutConfigService, private cardService: CardService, private route: ActivatedRoute,  private environmentStore: EnvironmentStore) {
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
    
    this.route.params.subscribe(params => {
    
     this.serial = params.serial;

    this.urlImage = `${this.environmentStore.ENV.API_URL}/assets/userPhotos/${this.serial}.bmp`;


    this.movementService.getMovements(this.serial, null, null, null).subscribe((data: any) => {
      if (data.movements) {
        this.movements = data.movements;
        this.profile = this.movements[0];
       
      }
    });






     //cahmadas 
     console.log('serial',this.serial);
    });
 
    this.chartOptions6 = this.getChartOptions6();

  }

  getChartOptions6() {
    return {
        series: [
          {
            name: "CF-ALF",
            type: "column",
            data: [8, 8, 8, 10, 12, 24, 10, ]
          },
          {
            name: "CF-EF",
            type: "column",
            data: [0, 0, 0, 0, 0, 0, 0,  ]
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
              text: "Horas na Unidade"
            }
          },
       
        ]
      };
    };






    Find() { console.log(this.model)}




   
    
    








}
