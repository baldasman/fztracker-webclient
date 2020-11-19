import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { LayoutConfigService } from '@core-modules/main-theme/services/layout-config.service';
import { Observable, Subscription } from 'rxjs';
import { CardService } from '@core-modules/core/services/card.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  chartOptions: any = {};
  chartOptions1: any = {};
  chartOptions2: any = {};
  chartOptions3: any = {};
  chartOptions4: any = {};
  chartOptions5: any = {};
  fontFamily = '';
  colorsGrayGray500 = '';
  colorsGrayGray200 = '';
  colorsGrayGray300 = '';
  colorsThemeBaseDanger = '';
  colorsThemeBasePrimary = '';
  colorsThemeLightPrimary = '';

  private _docSub: Subscription;

  constructor(private layoutConfigService: LayoutConfigService, private cardService: CardService) {
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
    this._docSub = this.cardService.notification.subscribe(data => {
      console.log('event', data);

      // save uuid to input
    });
 
    this.chartOptions = this.getChartOptions();
    this.chartOptions1 = this.getChartOptions1();
    this.chartOptions2 = this.getChartOptions2();
    this.chartOptions3 = this.getChartOptions3();
    this.chartOptions4 = this.getChartOptions4();
    this.chartOptions5 = this.getChartOptions5();

  }

  getChartOptions() {
    return {
      series: [
        {
          name: 'Total',
          data: [40, 50, 80, 90, 120, 200, 300]
        }
      ],
      chart: {
        type: 'area',
        height: 150,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {},
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'solid',
        opacity: 1
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [this.colorsThemeBasePrimary]
      },
      xaxis: {
        categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        },
        crosshairs: {
          show: false,
          position: 'front',
          stroke: {
            color: this.colorsGrayGray300,
            width: 1,
            dashArray: 3
          }
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        }
      },
      yaxis: {
        min: 0,
        max: 800,
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        }
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0
          }
        }
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: this.fontFamily
        },
        y: {
          // tslint:disable-next-line
          formatter: function (val) {
            return '' + val + ' Cartões';
          }
        },
        marker: {
          show: false
        }
      },
      colors: [this.colorsThemeLightPrimary],
      markers: {
        colors: this.colorsThemeLightPrimary,
        strokeColor: [this.colorsThemeBasePrimary],
        strokeWidth: 3
      }
    };
  }


    // Gráfico entradas EF

  getChartOptions1() {
    return {
      series: [
        {
          name: 'Total Entradas',
          data: [100, 80, 150, 199, 150, 23, 10]
        }
      ],
      chart: {
        type: 'bar',
        height: 150,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {},
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'solid',
        opacity: 1,
     
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: []
      },
      xaxis: {
        categories: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        },
        crosshairs: {
          show: false,
          position: 'front',
          stroke: {
            color: this.colorsGrayGray300,
            width: 1,
            dashArray: 3
          }
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        }
      },
      yaxis: {
        min: 0,
        max: 200,
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        }
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0
          }
        }
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: this.fontFamily
        },
        y: {
          // tslint:disable-next-line
          formatter: function (val) {
            return '' + val + ' Registos';
          }
        },
        marker: {
          show: false
        }
      },
      colors: [this.colorsThemeLightPrimary],
      markers: {
        colors: this.colorsThemeLightPrimary,
        strokeColor: [this.colorsThemeBasePrimary],
        strokeWidth: 3
      }
    };
  }




  
    // Gráfico entradas alf

    getChartOptions2() {
      return {
        series: [
          {
            name: 'Total Entradas',
            data: [100, 80, 150, 50, 150, 23, 10]
          }
        ],
        chart: {
          type: 'bar',
          height: 150,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          sparkline: {
            enabled: true
          }
        },
        plotOptions: {},
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'solid',
          opacity: 1,
       
        },
        stroke: {
          curve: 'smooth',
          show: true,
          width: 3,
          colors: []
        },
        xaxis: {
          categories: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'],
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            style: {
              colors: this.colorsGrayGray500,
              fontSize: '12px',
              fontFamily: this.fontFamily
            }
          },
          crosshairs: {
            show: false,
            position: 'front',
            stroke: {
              color: this.colorsGrayGray300,
              width: 1,
              dashArray: 3
            }
          },
          tooltip: {
            enabled: true,
            formatter: undefined,
            offsetY: 0,
            style: {
              fontSize: '12px',
              fontFamily: this.fontFamily
            }
          }
        },
        yaxis: {
          min: 0,
          max: 200,
          labels: {
            show: false,
            style: {
              colors: this.colorsGrayGray500,
              fontSize: '12px',
              fontFamily: this.fontFamily
            }
          }
        },
        states: {
          normal: {
            filter: {
              type: 'none',
              value: 0
            }
          },
          hover: {
            filter: {
              type: 'none',
              value: 0
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'none',
              value: 0
            }
          }
        },
        tooltip: {
          style: {
            fontSize: '12px',
            fontFamily: this.fontFamily
          },
          y: {
            // tslint:disable-next-line
            formatter: function (val) {
              return '' + val + ' Registos';
            }
          },
          marker: {
            show: false
          }
        },
        colors: [this.colorsThemeLightPrimary],
        markers: {
          colors: this.colorsThemeLightPrimary,
          strokeColor: [this.colorsThemeBasePrimary],
          strokeWidth: 3
        }
      };
    }
  
  
  
  
  
    // Gráfico entradas ccf

    getChartOptions3() {
      return {
        series: [
          {
            name: 'Total',
            data: [40, 50, 80, 90, 320, 400, 500]
          }
        ],
        chart: {
          type: 'area',
          height: 150,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          sparkline: {
            enabled: true
          }
        },
        plotOptions: {},
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'solid',
          opacity: 1
        },
        stroke: {
          curve: 'smooth',
          show: true,
          width: 3,
          colors: [this.colorsThemeBasePrimary]
        },
        xaxis: {
          categories: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'],
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            style: {
              colors: this.colorsGrayGray500,
              fontSize: '12px',
              fontFamily: this.fontFamily
            }
          },
          crosshairs: {
            show: false,
            position: 'front',
            stroke: {
              color: this.colorsGrayGray300,
              width: 1,
              dashArray: 3
            }
          },
          tooltip: {
            enabled: true,
            formatter: undefined,
            offsetY: 0,
            style: {
              fontSize: '12px',
              fontFamily: this.fontFamily
            }
          }
        },
        yaxis: {
          min: 0,
          max: 800,
          labels: {
            show: false,
            style: {
              colors: this.colorsGrayGray500,
              fontSize: '12px',
              fontFamily: this.fontFamily
            }
          }
        },
        states: {
          normal: {
            filter: {
              type: 'none',
              value: 0
            }
          },
          hover: {
            filter: {
              type: 'none',
              value: 0
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'none',
              value: 0
            }
          }
        },
        tooltip: {
          style: {
            fontSize: '12px',
            fontFamily: this.fontFamily
          },
          y: {
            // tslint:disable-next-line
            formatter: function (val) {
              return '' + val + ' Cartões';
            }
          },
          marker: {
            show: false
          }
        },
        colors: [this.colorsThemeLightPrimary],
        markers: {
          colors: this.colorsThemeLightPrimary,
          strokeColor: [this.colorsThemeBasePrimary],
          strokeWidth: 3
        }
      };
    };
  
    getChartOptions4() {
      return {
          series: [
            {
              name: "CF-ALF",
              type: "column",
              data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320]
            },
            {
              name: "CF-EF",
              type: "column",
              data: [220, 300, 200, 250, 100, 20, 30, 250, 300, 100,]
            }
          ],
          chart: {
            height: 400,
            type: "line"
          
           
          },

          toolbar: {
            show: false
          },

          stroke: {
            width: [0, 4]
          },
          title: {
            text: "Entradas Corpo de Fuzileiros"
          },
          dataLabels: {
            enabled: false,
            enabledOnSeries: []
          },
          labels: [
            "01 Jan 2020",
            "02 Jan 2020",
            "03 Jan 2020",
            "04 Jan 2020",
            "05 Jan 2020",
            "06 Jan 2020",
            "07 Jan 2020",
            "08 Jan 2020",
            "09 Jan 2020",
            "10 Jan 2020"
    
          ],
          xaxis: {
            type: "datetime"
          },
          yaxis: [
            {
              title: {
                text: "Nº de Registos"
              }
            },
         
          ]
        };
      };
    

      getChartOptions5() {
        return {
        series: [354, 254],
        chart: {
          width: 600,
          height: 600,
          type: "pie"
        },
        labels: ["No CCF", "Fora do CCF"],
        color: ["#86c7f3", "#fffff"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 640
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };


    }

















}
