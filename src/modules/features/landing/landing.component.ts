import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  // styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  private observablesSubscriptions: Subscription[] = [];

  constructor() {
    console.log('LandingComponent');
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.observablesSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}