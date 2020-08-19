import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {FormsService} from '@shared/catalog/forms';
import {LoaderService} from '@shared/catalog/loader/services/loader.service';
import * as Highcharts from 'highcharts';
import {forkJoin, Subscription} from 'rxjs';
import * as moment from 'moment';

import {ProductModel} from '../../models/product.model';
import {ProductService} from '../../services/product.service';
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private observablesSubscriptions: Subscription[] = [];

  // Declare public variables to use in html
  public contentReady: boolean;
  public products: Array<ProductModel>;
  public exportUrl: string;

  public searchForm: FormGroup;
  get f() {
    return this.searchForm.controls;
  }

  public chartOptions: any = {
    chart: {type: 'bar'},
    title: {text: 'Top Sales 2020'},
    xAxis: {categories: ['Apples', 'Bananas', 'Oranges']},
    yAxis: {title: {text: 'Fruit eaten'}},
    series: [{name: 'Jane', data: [1, 0, 4]}, {name: 'John', data: [5, 7, 3]}]
  }

  constructor(
      private productService: ProductService, private fb: FormBuilder,
      private formsService: FormsService, private loaderService: LoaderService,
      private t: TranslateService) {}

  ngOnInit() {
    this.contentReady = false;
    this.loaderService.start('homeContent');

    this.exportUrl = `${environment.apiUrl}insights/v1/user/list/export?token=${localStorage.getItem('token')}`;

    // Build form
    this.searchForm = this.fb.group({
      search: [null, []],
      startDate: [null, []],
      endDate: [null, []]
    });

    const params = {orderBy: 'productName'};

    // this.observablesSubscriptions.push(
    //   forkJoin([this.productService.getProducts(params)]).subscribe((response)
    //   => {}, (error) => {})
    // )

    this.observablesSubscriptions.push(
        this.productService.getProducts(params).subscribe(
            (response) => {
              if (response['products']) {
                this.products = response['products'];
              }

              this.draw();
            },
            (error) => {
              console.error(error);

              this.loaderService.stop('homeContent');
            }));
  }

  ngAfterViewInit() {}

  draw() {
    this.contentReady = true;

    

    Highcharts.chart('container', this.chartOptions);

    this.loaderService.stop('homeContent');
  }

  ngOnDestroy() {
    this.observablesSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  search() {
    console.log('params', this.searchForm.value.startDate);


    const params = {
      productName: this.searchForm.value.search,
      productId: this.searchForm.value.search,
      startDate: moment(new Date(this.searchForm.value.startDate.year, this.searchForm.value.startDate.month - 1, this.searchForm.value.startDate.day)).format('X'),
      endDate: moment(new Date(this.searchForm.value.endDate.year, this.searchForm.value.endDate.month - 1, this.searchForm.value.endDate.day)).format('X')
    };

    console.log('params', params);

    this.loaderService.start('homeContent');

    this.observablesSubscriptions.push(
      this.productService.getProducts(params).subscribe(
          (response) => {
            if (response['products']) {
              this.products = response['products'];
            }
            
            console.log(`From ${response['startDate']} to ${response['endDate']}`);

            this.loaderService.stop('homeContent');
          },
          (error) => {
            console.error(error);

            this.loaderService.stop('homeContent');
          }));
  }
}
