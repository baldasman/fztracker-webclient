import { Component, OnInit } from '@angular/core';

import { POSITION, SPINNER } from 'ngx-ui-loader';

@Component({
  selector: 'app-loader',
  templateUrl: 'app-loader.component.html'
})

export class AppLoaderComponent implements OnInit {

  public fgsPosition = POSITION.centerCenter;
  public fgsSize = 60;
  public fgsType = SPINNER.ballSpinClockwise;
  public hasProgressBar = false;

  constructor() { }

  ngOnInit() { }

}
