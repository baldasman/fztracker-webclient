import { Component, OnInit, AfterViewInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { get } from 'lodash';

import { LayoutConfigService } from '../../../services/layout-config.service';
import { HtmlClassService } from '../../../services/html-class.service';

import { OffcanvasOptions } from '../../../directives/offcanvas.directive';


@Component({
  selector: 'main-theme-aside-left',
  templateUrl: './aside-left.component.html',
  styleUrls: ['./aside-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideLeftComponent implements OnInit, AfterViewInit {
  @ViewChild('asideMenuOffcanvas', { static: true }) asideMenuOffcanvas: ElementRef;
  @ViewChild('asideMenu', { static: true }) asideMenu: ElementRef;

  private offcanvas: any;

  asideLogo = '';
  asideClasses = '';
  currentRouteUrl = '';
  insideTm: any;
  outsideTm: any;

  menuCanvasOptions: OffcanvasOptions = {
    baseClass: 'aside',
    overlay: true,
    closeBy: 'kt_aside_close_btn',
    toggleBy: {
      target: 'kt_aside_mobile_toggle',
      state: 'mobile-toggle-active'
    }
  };

  menuOptions /*: MenuOptions*/ = {
    // submenu setup
    submenu: {
      desktop: {
        // by default the menu mode set to accordion in desktop mode
        default: 'dropdown',
      },
      tablet: 'accordion', // menu set to accordion in tablet mode
      mobile: 'accordion' // menu set to accordion in mobile mode
    },

    // accordion setup
    accordion: {
      expandAll: false // allow having multiple expanded accordions in the menu
    }
  };


  constructor(
    public htmlClassService: HtmlClassService,
    // public menuAsideService: MenuAsideService,
    public layoutConfigService: LayoutConfigService,
    private router: Router,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,


  ) {
  }

  ngAfterViewInit(): void { }

  ngOnInit() {

    this.currentRouteUrl = this.router.url.split(/[?#]/)[0];

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
      this.cdr.markForCheck();
    });

    const config = this.layoutConfigService.getConfig();

    if (get(config, 'aside.menu.dropdown')) {
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown', '1');
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown-timeout', get(config, 'aside.menu.submenu.dropdown.hover-timeout'));
    }

    this.asideClasses = this.htmlClassService.getClasses('aside', true).toString();
    setTimeout(() => {
      this.offcanvas = new KTOffcanvas(this.asideMenuOffcanvas.nativeElement, this.menuCanvasOptions);
    });


  }

  // mouseEnter(e: Event) {
  //   // check if the left aside menu is fixed
  //   if (document.body.classList.contains('aside-fixed')) {
  //     if (this.outsideTm) {
  //       clearTimeout(this.outsideTm);
  //       this.outsideTm = null;
  //     }

  //     this.insideTm = setTimeout(() => {
  //       // if the left aside menu is minimized
  //       if (document.body.classList.contains('aside-minimize') && KTUtil.isInResponsiveRange('desktop')) {
  //         // show the left aside menu
  //         this.render.removeClass(document.body, 'aside-minimize');
  //         this.render.addClass(document.body, 'aside-minimize-hover');
  //       }
  //     }, 50);
  //   }
  // }

  // mouseLeave(e: Event) {
  //   if (document.body.classList.contains('aside-fixed')) {
  //     if (this.insideTm) {
  //       clearTimeout(this.insideTm);
  //       this.insideTm = null;
  //     }

  //     this.outsideTm = setTimeout(() => {
  //       // if the left aside menu is expand
  //       if (document.body.classList.contains('aside-minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
  //         // hide back the left aside menu
  //         this.render.removeClass(document.body, 'aside-minimize-hover');
  //         this.render.addClass(document.body, 'aside-minimize');
  //       }
  //     }, 100);
  //   }
  // }

  mobileMenuClose() {
    if (KTUtil.isBreakpointDown('lg') && this.offcanvas) { // Tablet and mobile mode
      this.offcanvas.hide(); // Hide offcanvas after general link click
    }
  }



}
