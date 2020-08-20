import { AfterViewInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { take } from 'rxjs/operators';

import { get, cloneDeep, upperFirst } from 'lodash';

import { Mixin, Core, Stores, Animations } from '@app/base';

import { ImportSystemModalComponent } from '@core-modules/main-theme/components/features/system/import-system-modal.component';
// import { ExportSystemModalComponent } from '@core-modules/main-theme/components/features/system/export-system/export-system-modal.component';

import { DialogsService } from '@core-modules/main-theme/services/dialogs.service';
import { LayoutConfigService } from '../../../../services/layout-config.service';
import { HtmlClassService } from '../../../../services/html-class.service';
import { SystemsService } from '../../../../services/systems.service';

import { OffcanvasOptions } from '../../../../directives/offcanvas.directive';
import { MenuOptions} from '../../../../directives/menu.directive';

import { menus, menuDatasources } from '../../../../_config/menus.config';

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
    private systemsService: SystemsService,
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

    if (menu.datasource) {
      const datasourceFuntions = {
        [menuDatasources.closeSystem]: this.closeSystem.bind(this),
        [menuDatasources.exportSystemWebtool]: this.exportSystemWebtool.bind(this),
        [menuDatasources.exportSystemWorkspace]: this.exportSystemWorkspace.bind(this),
        [menuDatasources.importSystemWebtool]: this.importSystemWebtool.bind(this),
        [menuDatasources.importSystemWorkspace]: this.importSystemWorkspace.bind(this),
        [menuDatasources.saveSystem]: this.saveSystem.bind(this)
      };
      datasourceFuntions[menu.datasource]();
      return;
    }
  }

  closeSystem() {
    if (!this.store.system.getSystem().id) {
      this.notification.error(this.translate('messages.errors.need_to_be_in_system'));
      return;
    }

    if (this.store.system.getSystem().isDirty) {
      this.dialogsService.openConfirmationDialog({
        title: this.translate('labels.close_system'),
        message: this.translate('messages.warnings.system_changes_will_be_lost', { systemName: this.store.system.getSystem().name }),
        confirmText: this.translate('labels.yes_close'),
        cancelText: upperFirst(this.translate('dictionary.cancel'))
      }).subscribe(evt => {
        // only override current system if chosen so
        if (evt) {
          this.store.system.closeSystem();
          this.notification.success(this.translate('messages.notifications.close.success'));
          this.router.navigateByUrl('/');
        }
      });
    } else {
      this.store.system.closeSystem();
      this.notification.success(this.translate('messages.notifications.close.success'));
      this.router.navigateByUrl('/');
    }
  }

  exportSystemWebtool() {
    if (!this.store.system.getSystem().id) {
      this.notification.error(this.translate('messages.errors.need_to_be_in_system'));
      return;
    }

    const system = cloneDeep(this.store.system.getSystemFullStateInfo());
    delete system.selectedGateway;

    this.systemsService.exportSystem(system).subscribe(
      res => {
        const contentDisposition = res.headers.get('content-disposition');
        const filename = contentDisposition?.split(';')[1]?.split('filename=')[1]?.replace(new RegExp('"', 'g'), '')?.trim() || `${this.store.system.getSystem().name}.iwfx`;
        this.downloadFile(res.body, filename, res.headers.get('content-type'));
      },
      () => this.notification.error('Error exporting system.')
    );
  }

  exportSystemWorkspace() {
    if (!this.store.system.getSystem().id) {
      this.notification.error(this.translate('messages.errors.need_to_be_in_system'));
      return;
    }

    const system = cloneDeep(this.store.system.getSystemFullStateInfo());
    delete system.selectedGateway;
    this.systemsService.exportSystemDesktopTool(system).pipe(take(1)).subscribe(
      res => {
        const contentDisposition = res.headers.get('content-disposition');
        const filename = contentDisposition?.split(';')[1]?.split('filename=')[1]?.replace(new RegExp('"', 'g'), '')?.trim() || `${this.store.system.getSystem().name}.isfx`;
        this.downloadFile(res.body, filename, res.headers.get('content-type'));
      },
      () => this.notification.error('Error exporting system.')
    );
  }

  importSystemWebtool() {
    if (!this.store.system.getSystem().id) {
      this.notification.error(this.translate('messages.errors.need_to_be_in_system'));
      return;
    }

    this.dialog.open(ImportSystemModalComponent, {
      panelClass: 'dialog-width-50',
      data: { type: 'webtool' }
    });
  }

  importSystemWorkspace() {
    if (!this.store.system.getSystem().id) {
      this.notification.error(this.translate('messages.errors.need_to_be_in_system'));
      return;
    }

    this.dialog.open(ImportSystemModalComponent, {
      panelClass: 'dialog-width-50',
      data: { type: 'workspace' }
    });
  }

  saveSystem() {
    if (!this.store.system.getSystem().id) {
      this.notification.error(this.translate('messages.errors.need_to_be_in_system'));
      return;
    }

    this.showPageLoader();
    this.store.system.saveSystem$().pipe(take(1)).subscribe(
      () => {
        this.notification.success(this.translate('messages.notifications.save.success'));
        this.hidePageLoader();
      },
      () => {
        this.notification.error(this.translate('messages.notifications.save.error'));
        this.hidePageLoader();
      }
    );
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
