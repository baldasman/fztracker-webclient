import { AfterContentInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[autoFocus]'
})
export class AutofocusDirective implements AfterContentInit {

  public constructor(private el: ElementRef) {}

  public ngAfterContentInit() {
    const id = this.el.nativeElement.getAttribute('id');
    const element = this.el.nativeElement.querySelector(`[id*=${id}]`);
    element.focus();
  }
}
