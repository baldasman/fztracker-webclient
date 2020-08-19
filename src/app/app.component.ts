import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private t: TranslateService
  ) {
    this.t.setDefaultLang('en');
    this.t.use('en');
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {}
}
