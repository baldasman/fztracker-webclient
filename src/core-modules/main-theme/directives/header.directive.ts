import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

import { merge } from 'lodash';

export interface HeaderOptions {
  classic?: any;
  offset?: any;
  minimize?: any;
}

@Directive({
  selector: '[ktHeader]',
  exportAs: 'ktHeader',
})
export class HeaderDirective implements AfterViewInit {
  @Input() options: HeaderOptions = {};

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.setupOptions();

    const header = new KTHeader(this.el.nativeElement, this.options);
  }

  private setupOptions() {
    this.options = {
      classic: {
        desktop: true,
        mobile: false
      },
    };

    if (this.el.nativeElement.getAttribute('data-header-minimize') === '1') {
      merge(this.options, 'minimize', {
        desktop: { on: 'header-minimize' },
        mobile: { on: 'header-minimize' }
      });
      merge(this.options, 'offset', {
        desktop: 200,
        mobile: 150
      });
    }
  }
}
