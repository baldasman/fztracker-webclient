import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Animations, Core, Mixin, Stores } from '@app/base';


@Component({
  selector: 'main-theme-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubheaderComponent extends Mixin(Core, Stores, Animations) implements OnInit {

  routeOptions: {
    layoutOptions: {}
    title: string;
  };

  showAddAppDevices = false;
  gatewaysWithUndeployedChanges = 0;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute
  ) { super(); }

  ngOnInit() {
    this.routeOptions = {
      layoutOptions: {
        addDevice: false
      },
      title: ''
    };
  }
}
