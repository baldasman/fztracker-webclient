import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from '@features/insights/services/product.service';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '@shared/catalog/loader/services/loader.service';
import * as Highcharts from 'highcharts';
import {Subscription} from 'rxjs';
import { ProductModel } from '@features/insights/models/product.model';
import { environment } from '@app/config/environment';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private observablesSubscriptions: Subscription[] = [];

  public isAdmin: boolean = false;
  public pdfUrl: string;

  public chartOptions: any = {
    chart: {type: 'pie'},
    title: {text: 'ABC - This trimestre'},
    subtitle: {text: 'Source: <a href="#abc-details">Full product list</a>'},
    plotOptions: {pie: {shadow: false, center: ['50%', '50%']}},
    tooltip: {valueSuffix: '%'},
    series: [{
      name: 'Products',
      data: [],
      size: '60%',
      dataLabels: {
        formatter:
            function() {
              return this.y > 5 ? this.point.name : null;
            },
        color: '#ffffff',
        distance: -30
      }
    }]
  };

  // Declare public variables to use in html
  public contentReady: boolean;
  public aProducts: Array<ProductModel>;
  public bProducts: Array<ProductModel>;
  public cProducts: Array<ProductModel>;

  constructor(
      private productService: ProductService,
      private loaderService: LoaderService, private t: TranslateService) {}

  ngOnInit() {
    this.isAdmin = (localStorage.getItem('isAdmin') == 'true');

    if (!this.isAdmin) {
      // alert("Não tem acesso a esta página!");

      // window.location.href = '/';
      this.contentReady = true;
      return;
    }


    this.loaderService.start('dashboardContent');

    this.pdfUrl = `${environment.apiUrl}insights/v1/pdf?token=${localStorage.getItem('token')}`;

    // Call abc API
    const params = {startDate: 1577836800, endDate: 1585699199};

    this.observablesSubscriptions.push(
        this.productService.getAbcByDates(params).subscribe(
            (response) => {
              if (response) {
                var colors = Highcharts.getOptions().colors;
                
                const abcPieChartData = [];
                const totalProducts = response['abc'].a.productCount +
                    response['abc'].b.productCount +
                    response['abc'].c.productCount;

                // Load Pie chart data
                abcPieChartData.push({
                  name: 'A',
                  y: response['abc'].a.productCount / totalProducts * 100,
                  color: colors[5]
                });

                abcPieChartData.push({
                  name: 'B',
                  y: response['abc'].b.productCount / totalProducts * 100,
                  color: colors[6]
                });

                abcPieChartData.push({
                  name: 'C',
                  y: response['abc'].c.productCount / totalProducts * 100,
                  color: colors[7]
                });

                this.chartOptions.series[0].data = abcPieChartData;

                this.aProducts = response['abc'].a.produts;
                this.bProducts = response['abc'].b.produts;
                this.cProducts = response['abc'].c.produts;
              }

              this.draw();
            },
            (error) => {
              console.error(error);

              this.loaderService.stop('dashboardContent');
            }));
  }

  ngAfterViewInit() {}

  draw() {
    this.contentReady = true;

    if (this.isAdmin) {
      console.log(this.chartOptions);
      Highcharts.chart('pie-chart-container', this.chartOptions);
    }

    this.loaderService.stop('dashboardContent');
  }

  ngOnDestroy() {
    this.observablesSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
