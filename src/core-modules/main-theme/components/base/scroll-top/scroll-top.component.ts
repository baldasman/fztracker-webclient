import { Component } from '@angular/core';
import { ScrollTopOptions } from '../../../directives/scroll-top.directive';

@Component({
  selector: 'main-theme-scroll-top',
  templateUrl: './scroll-top.component.html',
})
export class ScrollTopComponent {

  scrollTopOptions: ScrollTopOptions = {
    offset: 300,
    speed: 600
  };

}
