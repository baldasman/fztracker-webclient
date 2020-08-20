import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { get, has } from 'lodash';

import { LayoutConfigModel } from '../_config/layout-config.model';

export interface ClassType {
  header: string[];
  header_container: string[];
  header_mobile: string[];
  header_menu: string[];
  aside_menu: string[];
  subheader: string[];
  subheader_container: string[];
  content: string[];
  content_container: string[];
  footer_container: string[];
}

export interface AttrType {
  aside_menu: any;
}

@Injectable()
export class HtmlClassService {

  config: LayoutConfigModel;
  classes: ClassType;
  attrs: AttrType;
  onClassesUpdated$: BehaviorSubject<ClassType>;

  constructor() {
    this.onClassesUpdated$ = new BehaviorSubject(this.classes);
  }


  setConfig(layoutConfig: LayoutConfigModel) {
    this.config = this.preInit(layoutConfig);

    // scope list of classes
    this.classes = {
      header: [],
      header_container: [],
      header_mobile: [],
      header_menu: [],
      aside_menu: [],
      subheader: [],
      subheader_container: [],
      content: [],
      content_container: [],
      footer_container: []
    };

    this.attrs = {
      aside_menu: {}
    };

    // init base layout
    this.initLayout();
    this.initLoader();

    // init header and subheader menu
    this.initHeader();
    this.initSubheader();

    // init content
    this.initContent();
    // init aside and aside menu
    this.initAside();

    // init footer
    this.initFooter();

    this.initSkins();

    this.onClassesUpdated$.next(this.classes);
  }


  /**
   * Returns Classes
   *
   * @param path: string
   * @param toString boolean
   */
  getClasses(path?: string, toString?: boolean): ClassType | string[] | string {
    if (path) {
      const classes = get(this.classes, path) || '';
      if (toString && Array.isArray(classes)) {
        return classes.join(' ');
      }
      return classes.toString();
    }
    return this.classes;
  }

  getAttributes(path: string): any {
    return this.attrs[path];
  }

  private preInit(layout) {
    const updatedLayout = Object.assign({}, layout);
    const subheaderFixed = get(updatedLayout, 'subheader.fixed');
    const headerSelfFixedDesktop = get(updatedLayout, 'header.self.fixed.desktop');
    if (subheaderFixed && headerSelfFixedDesktop) {
      updatedLayout.subheader.style = 'solid';
    } else {
      updatedLayout.subheader.fixed = false;
    }

    return layout;
  }

  /**
   * Init Layout
   */
  private initLayout() {
    const selfBodyBackgroundImage = get(this.config, 'self.body.background-image');
    if (selfBodyBackgroundImage) {
      document.body.style.backgroundImage = `url("${selfBodyBackgroundImage}")`;
    }

    const selfBodyClass = ((get(this.config, 'self.body.class')) || '').toString();
    if (selfBodyClass) {
      const bodyClasses: string[] = selfBodyClass.split(' ');
      bodyClasses.forEach(cssClass => document.body.classList.add(cssClass));
    }
  }

  /**
   * Init Loader
   */
  private initLoader() {
  }

  /**
   * Init Header
   */
  private initHeader() {
    // Fixed header
    const headerSelfFixedDesktop = get(this.config, 'header.self.fixed.desktop');
    if (headerSelfFixedDesktop) {
      document.body.classList.add('header-fixed');
      this.classes.header.push('header-fixed');
    } else {
      document.body.classList.add('header-static');
    }

    const headerSelfFixedMobile = get(this.config, 'header.self.fixed.mobile');
    if (headerSelfFixedMobile) {
      document.body.classList.add('header-mobile-fixed');
      this.classes.header_mobile.push('header-mobile-fixed');
    }

    // Menu
    const headerMenuSelfDisplay = get(this.config, 'header.menu.self.display');
    const headerMenuSelfLayout = get(this.config, 'header.menu.self.layout');
    if (headerMenuSelfDisplay) {
      this.classes.header_menu.push(`header-menu-layout-${headerMenuSelfLayout}`);

      if (get(this.config, 'header.menu.self.rootArrow')) {
        this.classes.header_menu.push('header-menu-root-arrow');
      }
    }

    if (get(this.config, 'header.self.width') === 'fluid') {
      this.classes.header_container.push('container-fluid');
    } else {
      this.classes.header_container.push('container');
    }
  }

  /**
   * Init Subheader
   */
  private initSubheader() {
    const subheaderDisplay = get(this.config, 'subheader.display');
    if (subheaderDisplay) {
      document.body.classList.add('subheader-enabled');
    } else {
      return;
    }

    // Fixed content head
    const subheaderFixed = get(this.config, 'subheader.fixed');
    const headerSelfFixedDesktop = get(this.config, 'header.self.fixed.desktop');
    if (subheaderFixed && headerSelfFixedDesktop) {
      document.body.classList.add('subheader-fixed');
    }

    const subheaderStyle = get(this.config, 'subheader.style');
    if (subheaderStyle) {
      this.classes.subheader.push(`subheader-${subheaderStyle}`);
    }

    if (get(this.config, 'subheader.width') === 'fluid') {
      this.classes.subheader_container.push('container-fluid');
    } else {
      this.classes.subheader_container.push('container');
    }

    if (get(this.config, 'subheader.clear')) {
      this.classes.subheader.push('mb-0');
    }
  }

  // Init Content
  private initContent() {
    if (get(this.config, 'content.fit-top')) {
      this.classes.content.push('pt-0');
    }

    if (get(this.config, 'content.fit-bottom')) {
      this.classes.content.push('pb-0');
    }

    if (get(this.config, 'content.width') === 'fluid') {
      this.classes.content_container.push('container-fluid');
    } else {
      this.classes.content_container.push('container');
    }
  }

  /**
   * Init Aside
   */
  private initAside() {
    if (get(this.config, 'aside.self.display') !== true) {
      return;
    }

    // Enable Aside
    document.body.classList.add('aside-enabled');

    // Fixed Aside
    if (get(this.config, 'aside.self.fixed')) {
      document.body.classList.add('aside-fixed');
      // this.classes.aside.push('aside-fixed'); // Metronic BUG!
    } else {
      document.body.classList.add('aside-static');
    }

    // Check Aside
    if (get(this.config, 'aside.self.display') !== true) {
      return;
    }

    // Default fixed
    if (get(this.config, 'aside.self.minimize.default')) {
      document.body.classList.add('aside-minimize');
    }

    if (get(this.config, 'aside.self.minimize.hoverable')) {
      document.body.classList.add('aside-minimize-hoverable');
    }

    // Menu
    // Dropdown Submenu
    const asideMenuDropdown = get(this.config, 'aside.menu.dropdown');
    if (asideMenuDropdown) {
      this.classes.aside_menu.push('aside-menu-dropdown');
      // tslint:disable-next-line
      this.attrs.aside_menu['data-menu-dropdown'] = '1';
    }

    // Scrollable Menu
    if (asideMenuDropdown !== true) {
      // tslint:disable-next-line
      this.attrs.aside_menu['data-menu-scroll'] = '1';
    } else {
      // tslint:disable-next-line
      this.attrs.aside_menu['data-menu-scroll'] = '0';
    }

    const asideMenuSubmenuDropdownHoverTimout = get(this.config, 'aside.menu.submenu.dropdown.hover-timeout');
    if (asideMenuSubmenuDropdownHoverTimout) {
      // tslint:disable-next-line
      this.attrs.aside_menu['data-menu-dropdown-timeout'] = asideMenuSubmenuDropdownHoverTimout;
    }
  }

  /**
   * Init Footer
   */
  private initFooter() {
    // Fixed header
    if (get(this.config, 'footer.fixed') === true) {
      document.body.classList.add('footer-fixed');
    }

    if (get(this.config, 'footer.width') === 'fluid') {
      this.classes.footer_container.push('container-fluid');
    } else {
      this.classes.footer_container.push('container');
    }
  }

  /**
   * Set the body class name based on page skin options
   */
  private initSkins() {
    const headerSelfTheme = get(this.config, 'header.self.theme') || '';
    const brandSelfTheme = get(this.config, 'brand.self.theme') || '';
    const asideSelfDisplay = get(this.config, 'aside.self.display');
    if (asideSelfDisplay === false) {
      document.body.classList.add(`brand-${headerSelfTheme}`);
    } else {
      document.body.classList.add(`brand-${brandSelfTheme}`);
    }
  }
}
