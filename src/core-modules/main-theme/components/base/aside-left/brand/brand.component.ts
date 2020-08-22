import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HtmlClassService } from '../../../../services/html-class.service';
import { LayoutConfigService } from '../../../../services/layout-config.service';


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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.headerLogo = 'assets/images/logos/default-logo.png';
    this.brandClasses = this.htmlClassService.getClasses('brand', true).toString();
    this.asideSelfMinimizeToggle = this.layoutConfigService.getConfig('aside.self.minimize.toggle');

  }

  ngAfterViewInit(): void { }

  goToHome() {
    this.router.navigateByUrl('/');
  }

  toggleAsideClick() {
    document.body.classList.toggle('aside-minimize');
  }

}
