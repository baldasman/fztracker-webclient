import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '@shared/catalog/loader/services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})

export class InsightsComponent implements OnInit, AfterViewInit, OnDestroy {
  private observablesSubscriptions: Subscription[] = [];

  constructor(
      private loaderService: LoaderService, private t: TranslateService) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.observablesSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
