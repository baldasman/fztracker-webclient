import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToggleOptions } from '../../../../directives/toggle.directive';
import { HtmlClassService } from '../../../../services/html-class.service';
import { LayoutConfigService } from '../../../../services/layout-config.service';


@Component({
  selector: 'main-theme-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {

  headerLogo = '';
  asideSelfDisplay = true;
  headerMenuSelfDisplay = true;
  headerMobileClasses = '';

  toggleOptions: ToggleOptions = {
    target: KTUtil.getBody(),
    targetState: 'topbar-mobile-on',
    toggleState: 'active'
  };

  constructor(
    private layoutConfigService: LayoutConfigService,
    private router: Router,
    private htmlClassService: HtmlClassService
  ) { }

  ngOnInit() {
    this.headerLogo = 'assets/images/logos/default-logo.png';

    this.headerMobileClasses = this.htmlClassService.getClasses('header_mobile', true).toString();
    this.asideSelfDisplay = this.layoutConfigService.getConfig('aside.self.display');
    this.headerMenuSelfDisplay = this.layoutConfigService.getConfig('header.menu.self.display');
  }

  goToHome() {
    this.router.navigateByUrl('/');
  }
}
