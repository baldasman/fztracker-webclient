import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, FormGroup, Forms, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EnvironmentStore } from '@core-modules/stores';
import { MovementsService } from '@core-modules/core/services/movements.service';
import { MovementModel } from '@core-modules/core/models/movement.model';
import { Console } from 'console';
import { EntityService } from '@core-modules/core/services/entity.service';









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

  urlImage: string = "assets/media/users/1212.jpg";
  name: string = "Conceição Silva";
  rankClass: string = "Civil";
  totalRegistos: number = 300;
  location: string = "";
  cardNumber: string = "M0001";
  cardUid: string = "US12324235322";
  addDate: string = "17/01/2020";
  cardType: string = "Civil";
  lastRegistDate: Date;
  lastRegistHora: Date;
  cardStatus: string = "Saída";
  cardStatusColor: string = "label-light-danger";
  serial: string;
  movements: MovementModel[];
  profile;
  public paginaAtual = 1;
  private _docSub: Subscription;

  entitySearchform: FormGroup;
  get fes() { return this.entitySearchform.controls; }

  assignCardform: FormGroup;
  get fac() { return this.assignCardform.controls; }

  constructor(private entityService: EntityService, private movementService: MovementsService, private layoutConfigService: LayoutConfigService, private cardService: CardService, private route: ActivatedRoute, private environmentStore: EnvironmentStore) {
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

    this.route.params.subscribe(params => {

      this.serial = params.serial;

      this.urlImage = `${this.environmentStore.ENV.API_URL}/assets/userPhotos/${this.serial}.bmp`;


      this.movementService.getMovements(this.serial, null, null, null).subscribe((data: any) => {
        if (data.movements) {
          this.movements = data.movements;



          console.log('teste2', data.movements[0]);
          this.profile = this.movements[0].entitySerial;
          this.name = this.movements[0].entityName;
          this.cardNumber = this.movements[0].cardNumber;
          this.cardUid = this.movements[0].entitySerial;
          this.addDate = this.movements[0].entitySerial;
          this.cardType = this.movements[0].entityType;
          this.location = this.movements[0].location;
          this.lastRegistDate = this.movements[0].movementDate;;
          this.lastRegistHora = this.movements[0].movementDate;
          if (this.movements[0].inOut == true) {
            this.cardStatus = "Entrada";
            this.cardStatusColor = "label-light-success";
          };
        }
      });


      this.entityService.getEntity({ serial: this.serial }).subscribe((data: any) => {
        if (data.entities && data.entities.length === 1) {
          const entity = data.entities[0];
          console.log('entidade', entity);
        }

      });



      //cahmadas 

    });

    this.chartOptions6 = this.getChartOptions6();

  }

  getChartOptions6() {
    return {
      series: [
        {
          name: "CF-ALF",
          type: "column",
          data: [8, 8, 8, 10, 12, 24, 10,]
        },
        {
          name: "CF-EF",
          type: "column",
          data: [0, 0, 0, 0, 0, 0, 0,]
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






  Find() { console.log(this.model) }















}
