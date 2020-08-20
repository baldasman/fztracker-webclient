
import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

import { get, merge } from 'lodash';

export interface MenuOptions {
  scroll?: any;
  submenu?: any;
  accordion?: any;
  dropdown?: any;
}

/**
 * Configure menu
 */
@Directive({
  selector: '[ktMenu]',
  exportAs: 'ktMenu',
})
export class MenuDirective implements AfterViewInit {

  @Input() options: MenuOptions;

  private menu: any;

  /**
   * Directive Constructor
   * @param el: ElementRef
   */
  constructor(private el: ElementRef) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.setupOptions();
    this.menu = new KTMenu(this.el.nativeElement, this.options);
  }

  /**
   * Return the menu
   */
  getMenu() {
    return this.menu;
  }

  /**
   * Setup menu options
   */
  private setupOptions() {
    // init aside menu
    let menuDesktopMode = 'accordion';
    if (this.el.nativeElement.getAttribute('data-menu-dropdown') === '1') {
      menuDesktopMode = 'dropdown';
    }

    if (typeof get(this.options, 'submenu.desktop') === 'object') {
      merge(this.options, 'submenu.desktop', menuDesktopMode);
    }
  }
}
