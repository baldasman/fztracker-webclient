import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { get } from 'lodash';

import { LayoutConfigService } from '../services/layout-config.service';
import { HtmlClassService } from '../services/html-class.service';

import { LayoutConfig } from '../_config/layout.config';

@Component({
  selector: 'main-theme-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnInit, OnDestroy {

  selfLayout = 'default';
  asideSelfDisplay: true;
  contentClasses = '';
  contentContainerClasses = '';
  subheaderDisplay = true;
  contentExtended: false;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly htmlClassService: HtmlClassService,
    private readonly layoutConfigService: LayoutConfigService
  ) {


    // register configs by demos
    this.layoutConfigService.loadConfiguration(new LayoutConfig().configs);
    // this.menuConfigService.loadConfigs(new MenuConfig().configs);
    // this.pageConfigService.loadConfigs(new PageConfig().configs);

    // setup element classes
    this.htmlClassService.setConfig(this.layoutConfigService.getConfig());

    this.subscriptions.push(
      this.layoutConfigService.onConfigUpdated$.subscribe(layoutConfig => {
        // reset body class based on global and page level layout config, refer to html-class.service.ts
        document.body.className = '';
        this.htmlClassService.setConfig(layoutConfig);
      })
    );

  }


  ngOnInit(): void {
    const config = this.layoutConfigService.getConfig();
    // Load UI from Layout settings
    // this.selfLayout = get(config, 'self.layout');
    this.asideSelfDisplay = get(config, 'aside.self.display');
    this.subheaderDisplay = get(config, 'subheader.display');
    this.contentClasses = this.htmlClassService.getClasses('content', true).toString();
    this.contentContainerClasses = this.htmlClassService.getClasses('content_container', true).toString();
    this.contentExtended = get(config, 'content.extended');

    // let the layout type change
    // this.subscriptions.push(
    //   this.layoutConfigService.onConfigUpdated$.subscribe(cfg => {
    //     setTimeout(() => {
    //       this.selfLayout = get(cfg, 'self.layout');
    //     });
    //   })
    // );
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
