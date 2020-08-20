import { Component, ViewChild, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { take } from 'rxjs/operators';

import { Mixin, Stores, Core, Animations } from '@app/base';

import { AsideBarComponent } from '../../aside-bar/aside-bar.component';

import { SystemModel, SystemGatewayModel, SystemGatewayFieldDeviceModel, SystemGatewayApplicationBindingModel } from '@core-modules/stores/system/system.models';

class DirtyFieldDevices extends SystemGatewayFieldDeviceModel {
  dirtyApplicationBindings: SystemGatewayApplicationBindingModel[];
}

class DirtyGateways extends SystemGatewayModel {
  dirtyFieldDevices: DirtyFieldDevices[];
}

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

  systemChanges: {
    isDirty: boolean,
    dirtyGateways: DirtyGateways[]
  };
  sections: {
    gateways: boolean[];
    fieldDevices: { gateway: string; fieldDevice: string; open: boolean }[];
  };

  constructor() { super(); }

  ngOnInit() {

    this.subscriptions.push(
      this.store.system.getSystem$().subscribe((system: SystemModel) => {
        this.sections = {
          gateways: [],
          fieldDevices: []
        };

        this.systemChanges = {
          isDirty: system.isDirty,
          dirtyGateways: this.store.system.getDirtyGateways().map(dg => {
            this.sections.gateways.push(false);

            const dirtyFieldDevices = (dg.fieldDevices.filter(d => {
              this.sections.fieldDevices.push({ gateway: dg.id, fieldDevice: d.id, open: false });
              return d.isDirty;
            }) as DirtyFieldDevices[]);

            return {
              ...dg,
              dirtyFieldDevices: dirtyFieldDevices.map(fd => ({ ...fd, dirtyApplicationBindings: fd.applicationBindings.filter(ab => ab.isDirty) }))
            };
          }) as DirtyGateways[]
        };

      })
    );

  }

  isFieldDeviceOpened(fieldDevice: string, gateway: string) {
    return this.sections.fieldDevices.find(fd => fd.fieldDevice === fieldDevice && fd.gateway === gateway)?.open;
  }

  onToogleNotifications() {
    this.asideBarComponent.toggle();
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

  toggleGatewaySection(index: number) {
    this.sections.gateways[index] = !this.sections.gateways[index];
  }

  toggleFieldDeviceSection(fieldDevice: string, gateway: string) {
    const section = this.sections.fieldDevices.find(fd => fd.fieldDevice === fieldDevice && fd.gateway === gateway);
    section.open = !section.open;

  }

}
