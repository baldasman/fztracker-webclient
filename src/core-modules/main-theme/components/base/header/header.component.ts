import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';

import { LoadingBarService } from '@ngx-loading-bar/core';

import { LayoutConfigService } from '../../../services/layout-config.service';
import { HtmlClassService } from '../../../services/html-class.service';


@Component({
  selector: 'main-theme-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('ktHeader', {static: true}) ktHeader: ElementRef;

  headerClasses = '';
  headerContainerClasses = '';
  headerMenuClasses = '';
  headerLogo = '';
  headerAttributes = {};
  headerMenuSelfDisplay = true;

  constructor(
    private router: Router,
    private layoutConfigService: LayoutConfigService,
    public loader: LoadingBarService,
    public htmlClassService: HtmlClassService
  ) {
    // page progress bar percentage
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // set page progress bar loading to start on NavigationStart event router
        this.loader.start();
      }
      if (event instanceof RouteConfigLoadStart) {
        this.loader.increment(35);
      }
      if (event instanceof RouteConfigLoadEnd) {
        this.loader.increment(75);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // set page progress bar loading to end on NavigationEnd event router
        this.loader.complete();
      }
    });
  }

  ngOnInit(): void {
    this.headerClasses = this.htmlClassService.getClasses('header', true).toString();
    this.headerAttributes = this.htmlClassService.getAttributes('header');
    // this.headerLogo = this.getLogo();
    this.headerMenuSelfDisplay = this.layoutConfigService.getConfig('header.menu.self.display');
    this.headerContainerClasses = this.htmlClassService.getClasses('header_container', true).toString();
    this.headerMenuClasses = this.htmlClassService.getClasses('header_menu', true).toString();
    // header width fluid

    // animate the header minimize the height on scroll down. to be removed, not applicable for default demo
    /*if (objectPath.get(config, 'header.self.fixed.desktop.enabled') || objectPath.get(config, 'header.self.fixed.desktop')) {
      // header minimize on scroll down
      this.ktHeader.nativeElement.setAttribute('data-ktheader-minimize', '1');
    }*/
  }

  ngAfterViewInit(): void {
    // keep header element in the service
    // this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
  }
}
