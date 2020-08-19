import { Component, OnInit, Input } from '@angular/core';

import { POSITION, SPINNER } from 'ngx-ui-loader';

@Component({
  selector: 'app-section-loader',
  templateUrl: 'section-loader.component.html'
})

export class SectionLoaderComponent implements OnInit {

  @Input() loaderId: string;

  public fgsPosition = POSITION.centerCenter;
  public fgsSize = 60;
  public fgsType = SPINNER.ballSpinClockwise;
  public hasProgressBar = false;
  public blur = 15;

  constructor() {}

  ngOnInit() {}

}
