import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Animations, Core, Mixin, Stores } from '@app/base';
import { AsideBarComponent } from '../../aside-bar/aside-bar.component';


@Component({
  selector: 'main-theme-header-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  animations: [
    trigger('grow', [
      state('big', style({ height: '*', overflow: 'hidden' })),
      state('small', style({ height: '0px', visibility: 'hidden', overflow: 'hidden' })),
      transition('big <=> small', animate(250))
    ])
  ]
})
export class TopbarComponent extends Mixin(Core, Stores, Animations) implements OnInit {
  @ViewChild(AsideBarComponent, { static: true }) asideBarComponent: AsideBarComponent;

  constructor() { super(); }

  ngOnInit() {}

  onToogleNotifications() {
    this.asideBarComponent.toggle();
  }

}
