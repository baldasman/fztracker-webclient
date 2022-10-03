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
import { CardsService } from '@core-modules/core/services/cards.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.scss'],
})
export class CardProfileComponent
  extends Mixin(Core, Animations, Forms, Stores)
  implements OnInit, OnDestroy
{
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

  urlImage: string = 'assets/media/users/1212.jpg';
  name: string = 'Conceição Silva';
  rankClass: string = 'Civil';
  totalRegistos: number = 300;
  location: string = '';
  cardNumber: string = 'M0001';
  cardUid: string = 'US12324235322';
  addDate: string = '';
  cardType: string = 'Civil';
  lastRegistDate = {
    date: null,
    location: null,
  };
  lastExitDate = {
    date: null,
    location: '---',
  };
  stats: {
    last7daysTotalHours: number;
    last7daysAvgHours: number;
  } = { last7daysTotalHours: 0, last7daysAvgHours: 0 };
  cardStatus: string = 'Saída';
  cardStatusColor: string = 'label-light-danger';
  serial: string;
  movements: MovementModel[];
  profile;
  toDate;
  fromDate;
  inOut: string = 'true';

  term;

  local: string = null;
  public paginaAtual = 1;
  itemsPerPage = 15;
  private _docSub: Subscription;

  entitySearchform: FormGroup;
  get fes() {
    return this.entitySearchform.controls;
  }

  assignCardform: FormGroup;
  get fac() {
    return this.assignCardform.controls;
  }

  constructor(
    private cardsService: CardsService,
    private entityService: EntityService,
    private movementService: MovementsService,
    private layoutConfigService: LayoutConfigService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private environmentStore: EnvironmentStore
  ) {
    super();
    this.fontFamily = this.layoutConfigService.getConfig('js.fontFamily');
    this.colorsGrayGray500 = this.layoutConfigService.getConfig(
      'js.colors.gray.gray500'
    );
    this.colorsGrayGray200 = this.layoutConfigService.getConfig(
      'js.colors.gray.gray200'
    );
    this.colorsGrayGray300 = this.layoutConfigService.getConfig(
      'js.colors.gray.gray300'
    );
    this.colorsThemeBaseDanger = this.layoutConfigService.getConfig(
      'js.colors.theme.base.danger'
    );
    this.colorsThemeBasePrimary = this.layoutConfigService.getConfig(
      'js.colors.theme.base.primary'
    );
    this.colorsThemeLightPrimary = this.layoutConfigService.getConfig(
      'js.colors.theme.light.primary'
    );
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.serial = params.serial;

      this.urlImage = `${this.environmentStore.ENV.API_URL}/assets/userPhotos/${this.serial}.bmp`;

      var currentTime = new Date();
      var month = currentTime.getMonth() + 1;
      var day = currentTime.getDate();
      var year = currentTime.getFullYear();
      const todayDate = year + '-' + month + '-' + day;
      var month2 = month - 1;
      var year2 = year;
      if (month2 == 0) {
        (month2 = 12), (year2 = year - 1);
      }

      var oldDate = year2 + '-' + month2 + '-' + day;
      this.fromDate = oldDate;
      this.toDate = todayDate;

      this.entityService
        .getEntity({ serial: this.serial })
        .subscribe((data: any) => {
          console.log('getEntity', data);

          if (data.entities && data.entities.length === 1) {
            const entity = data.entities[0];
            console.log('entidade', entity);
            this.profile = entity.serial;

            this.name = entity.name;
            this.cardNumber = entity.cardNumber;

            this.cardType = entity.type;
            //this.location = entity.location;
            // this.lastRegistDate = entity.lastMovementDate;
            // this.lastRegistHora = entity.lastMovementDate;
            // console.log('a mov é ' + entity.inOut);
            // console.log('a cor é' + this.cardStatus, this.cardStatusColor);
            if (entity.inOut == true) {
              console.log();
              this.cardStatus = 'Entrada';
              this.cardStatusColor = 'label-light-success';
            }

            // Get Movements for entity
            this.getMovements();
          }
        });

      this.cardsService.getCards(this.serial).subscribe((data: any) => {
        const cdr = data.cards[0];
        console.log('cartão', cdr);
        this.addDate = cdr.lastChangeDate;
        this.cardUid = cdr.uid;
        console.log('data', this.addDate);
        console.log('UID', this.cardUid);
      });

      //cahmadas

      this.getSiteHours();
    });

    this.chartOptions6 = this.getChartOptions6();
  }

  getChartOptions6() {
    let day1 = moment().subtract('6', 'days');
    let day2 = moment().subtract('5', 'days');
    let day3 = moment().subtract('4', 'days');
    let day4 = moment().subtract('3', 'days');
    let day5 = moment().subtract('2', 'days');
    let day6 = moment().subtract('1', 'days');
    let day7 = moment();

    let xdata1 = 8;

    this.movementService
      .getMovements(this.serial, day1.toString(), day1.toString(), null)
      .subscribe((data: any) => {
        if (data.movements) {
          let movements2 = data.movements;
          console.log('o movemento do dia ', movements2);

          console.log('o movemento do dia ', movements2[0].cardNumber);
        }
      });

    return {
      series: [],
      chart: {
        height: 200,
        type: 'line',
        toolbar: {
          show: true,
          // offsetX: 0,
          // offsetY: 0,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: [],
          },
        },
      },

      stroke: {
        width: [0, 4],
      },
      title: {
        text: 'Corpo de Fuzileiros - Grafico em desenvolvimento',
      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: [],
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
        type: 'datetime',
      },
      yaxis: [
        {
          title: {
            text: 'Horas na Unidade',
          },
        },
      ],
    };
  }

  Find() {
    console.log(this.model);
  }

  Abc(position) {
    var pos = this.itemsPerPage * (this.paginaAtual - 1) + position;
    Swal.fire({
      imageUrl: `assets/media/users/${this.movements[pos].entitySerial}.bmp`,
      imageAlt: 'Sem foto',
    });
  }

  getMovements(): void {
    this.movementService
      .getMovements(this.serial, this.fromDate, this.toDate, null)
      .subscribe((data: any) => {
        if (data.movements) {
          this.movements = data.movements;

          if (data.movements && data.movements.length > 0) {
            console.log('teste2', data.movements[0]);
            //this.profile = this.movements[0].entitySerial;
            //this.name = this.movements[0].entityName;
            //this.cardNumber = this.movements[0].cardNumber;

            //this.cardType = this.movements[0].entityType;
            this.location = this.movements[0].location;
            //this.lastRegistDate = this.movements[0].movementDate;;
            //this.lastRegistHora = this.movements[0].movementDate;
            //console.log('a mov é ' + this.movements[0].inOut);
            //console.log('a cor é' + this.cardStatus, this.cardStatusColor);
            /*if (this.movements[0].inOut == true) {
            console.log();
            this.cardStatus = "Entrada";
            this.cardStatusColor = "label-light-success";


          };*/
          }
        }
      });
  }

  getSiteHours(): void {
    let minus7days = moment().subtract('6', 'days');
    let today = moment();

    this.movementService
      .getSiteHours(this.serial, minus7days.toISOString(), today.toISOString())
      .subscribe((data) => {
        console.log('on getSiteHours', data);
        this.chartOptions6.series = [];
        let labels = [];
        let totalHours = 0;
        let avgHours = 0;

        for (const s in data.siteHours.sites) {
          const site = data.siteHours.sites[s];

          const serie = {
            name: s,
            type: 'column',
            data: [],
          };

          labels = [];
          for (let i = 0; i < site.days.length; i++) {
            serie.data.push(site.days[i].hours);
            labels.push(moment(site.days[i].date).format('DD MMM'));
            totalHours += site.days[i].hours;
          }

          this.chartOptions6.labels = labels;
          this.chartOptions6.series.push(serie);

          if (site.lastIn) {
            const siteLastRegistDate = moment(site.lastIn).toDate();

            if (
              !this.lastRegistDate.date ||
              siteLastRegistDate > this.lastRegistDate.date
            ) {
              this.lastRegistDate.date = siteLastRegistDate;
              this.lastRegistDate.location = s;
            }
          }

          if (site.lastOut) {
            const siteLastExitDate = moment(site.lastOut).toDate();

            if (
              !this.lastExitDate.date ||
              siteLastExitDate > this.lastRegistDate.date
            ) {
              this.lastExitDate.date = siteLastExitDate;
              this.lastExitDate.location = s;
            }
          }
        }

        this.stats.last7daysTotalHours = totalHours;

        if (this.stats.last7daysTotalHours > 0) {
          this.stats.last7daysAvgHours = Math.round(this.stats.last7daysTotalHours / 7 * 100) / 100;
        }
      });
  }
}
