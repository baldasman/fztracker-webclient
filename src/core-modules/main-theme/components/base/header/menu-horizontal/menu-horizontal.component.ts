import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd } from '@angular/router';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { DialogsService } from '@core-modules/main-theme/services/dialogs.service';
import { get } from 'lodash';
import { filter } from 'rxjs/operators';
import { MenuOptions } from '../../../../directives/menu.directive';
import { OffcanvasOptions } from '../../../../directives/offcanvas.directive';
import { HtmlClassService } from '../../../../services/html-class.service';
import { LayoutConfigService } from '../../../../services/layout-config.service';
import { menus } from '../../../../_config/menus.config';


@Component({
  selector: 'main-theme-header-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuHorizontalComponent extends Mixin(Core, Stores, Animations) implements OnInit, AfterViewInit {

  @Input() headerMenuClasses: string;

  @ViewChild('headerMenuOffcanvas', { static: true }) headerMenuOffcanvas: ElementRef;

  private offcanvas: any;

  headerMenus = menus.header.items;

  currentRouteUrl: any = '';
  asideSelfDisplay = '';
  rootArrowEnabled: boolean;

  menuOptions: MenuOptions = {
    submenu: {
      desktop: 'dropdown',
      tablet: 'accordion',
      mobile: 'accordion'
    },
    accordion: {
      slideSpeed: 200, // accordion toggle slide speed in milliseconds
      expandAll: false // allow having multiple expanded accordions in the menu
    },
    dropdown: {
      timeout: 50
    }
  };

  offcanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: 'header-menu-wrapper',
    closeBy: 'kt_header_menu_mobile_close_btn',
    toggleBy: {
      target: 'kt_header_mobile_toggle',
      state: 'mobile-toggle-active'
    }
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private dialogsService: DialogsService,
    private layoutConfigService: LayoutConfigService,
    public htmlClassService: HtmlClassService,
  ) {
    super();
  }



  ngOnInit(): void {
    this.rootArrowEnabled = this.layoutConfigService.getConfig('header.menu.self.rootArrow');
    this.currentRouteUrl = this.router.url;
    setTimeout(() => {
      this.offcanvas = new KTOffcanvas(this.headerMenuOffcanvas.nativeElement, this.offcanvasOptions);
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRouteUrl = this.router.url;
        this.mobileMenuClose();
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void { }


  onMenuClick(menu: { page?: string, modal?: { component: any, class: string }, datasource?: string }) {

    if (menu.page) {
      this.router.navigateByUrl(menu.page || '');
      return;
    }

    if (menu.modal) {
      this.dialog.open(menu.modal.component, {
        panelClass: (menu.modal.class ? menu.modal.class : '')
      });
      return;
    }
  }

  downloadFile(data, name, type) {
    const blob = new Blob([data], { type });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  /**
   * Return Css Class Name
   * @param item: any
   */
  getItemCssClasses(item) {
    let classes = 'menu-item';

    if (get(item, 'submenu')) {
      classes += ' menu-item-submenu';
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-active menu-item-here';
    }

    if (item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-open menu-item-here';
    }

    if (get(item, 'resizer')) {
      classes += ' menu-item-resize';
    }

    const menuType = get(item, 'submenu.type') || 'classic';
    if ((get(item, 'root') && menuType === 'classic')
      || parseInt(get(item, 'submenu.width'), 10) > 0) {
      classes += ' menu-item-rel';
    }

    const customClass = get(item, 'custom-class');
    if (customClass) {
      classes += ' ' + customClass;
    }

    if (get(item, 'icon-only')) {
      classes += ' menu-item-icon-only';
    }

    return classes;
  }

  /**
   * Returns Attribute SubMenu Toggle
   * @param item: any
   */
  getItemAttrSubmenuToggle(item) {
    let toggle = 'hover';
    if (get(item, 'toggle') === 'click') {
      toggle = 'click';
    } else if (get(item, 'submenu.type') === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  /**
   * Returns Submenu CSS Class Name
   * @param item: any
   */
  getItemMenuSubmenuClass(item) {
    let classes = '';

    const alignment = get(item, 'alignment') || 'right';

    if (alignment) {
      classes += ' menu-submenu-' + alignment;
    }

    const type = get(item, 'type') || 'classic';
    if (type === 'classic') {
      classes += ' menu-submenu-classic';
    }
    if (type === 'tabs') {
      classes += ' menu-submenu-tabs';
    }
    if (type === 'mega') {
      if (get(item, 'width')) {
        classes += ' menu-submenu-fixed';
      }
    }

    if (get(item, 'pull')) {
      classes += ' menu-submenu-pull';
    }

    return classes;
  }

  /**
   * Check Menu is active
   * @param item: any
   */
  isMenuItemIsActive(item): boolean {
    if (item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  /**
   * Check Menu Root Item is active
   * @param item: any
   */
  isMenuRootItemIsActive(item): boolean {
    if (item.submenu.items) {
      for (const subItem of item.submenu.items) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (item.submenu.columns) {
      for (const subItem of item.submenu.columns) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (typeof item.submenu[Symbol.iterator] === 'function') {
      for (const subItem of item.submenu) {
        const active = this.isMenuItemIsActive(subItem);
        if (active) {
          return true;
        }
      }
    }

    return false;
  }

  mobileMenuClose() {
    if (KTUtil.isBreakpointDown('lg') && this.offcanvas) { // Tablet and mobile mode
      this.offcanvas.hide(); // Hide offcanvas after general link click
    }
  }

}
