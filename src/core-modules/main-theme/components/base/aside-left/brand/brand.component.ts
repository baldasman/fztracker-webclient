import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { LayoutConfigService } from '../../../../services/layout-config.service';
import { HtmlClassService } from '../../../../services/html-class.service';

import { SystemStore } from '@core-modules/stores';

@Component({
  selector: 'main-theme-aside-left-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandComponent implements OnInit, AfterViewInit {

  headerLogo = '';
  brandClasses = '';
  asideSelfMinimizeToggle = true;

  constructor(
    private layoutConfigService: LayoutConfigService,
    private htmlClassService: HtmlClassService,
    private router: Router,
    private systemStore: SystemStore
  ) { }


  ngOnInit(): void {
    this.headerLogo = 'assets/images/logos/default-logo.png';
    this.brandClasses = this.htmlClassService.getClasses('brand', true).toString();
    this.asideSelfMinimizeToggle = this.layoutConfigService.getConfig('aside.self.minimize.toggle');

  }

  ngAfterViewInit(): void { }


  goToHome() {
    if (this.systemStore.getSystem() && this.systemStore.getSystem().id) {
      this.router.navigateByUrl(`/${this.systemStore.getSystem().id}`);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  toggleAsideClick() {
    document.body.classList.toggle('aside-minimize');
  }

}
