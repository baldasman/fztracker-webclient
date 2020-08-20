import { Component, Input, OnInit, AfterViewInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';

import { EnvironmentStore } from '../../../../stores';

@Component({
  selector: 'main-theme-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss']
})
export class AsideBarComponent implements OnInit, AfterViewInit {
  @Input() name: string;
  @Input() mode?: string;
  @Input() position?: string;
  @Input() backdrop?: boolean;
  @Input() sidenavStyleClass: string;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private environmentStore: EnvironmentStore
  ) { }

  ngOnInit() {
    this.mode = this.mode || 'over'; // side || over || push.
    this.position = this.position || 'start'; // start || end.
    this.backdrop = this.backdrop === undefined ? true : this.backdrop;
    this.sidenavStyleClass = this.sidenavStyleClass || null;
  }

  ngAfterViewInit() {
    this.environmentStore.setLayoutElement(this.name, this.sidenav);
  }

  open() { this.sidenav.open(); }

  close() { this.sidenav.close(); }

  toggle() { this.sidenav.toggle(); }

}
