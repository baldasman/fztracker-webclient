import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take, map } from 'rxjs/operators';
import { upperFirst } from 'lodash';

import { Mixin, Core, Stores, Animations } from '@app/base';

import { SystemGatewayStatusEnum, SystemGatewayDeployInfo } from '../../../../stores';

import { DeployGatewaysListModalComponent } from '../../features/deploy/deploy-gateways-list/deploy-gateways-list-modal.component';
import { GenericDialogComponent } from '../../shared/dialogs/generic-dialog.component';

// interface Breadcrumb {
//   title: string;
//   page: string | any;
// }

@Component({
  selector: 'main-theme-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubheaderComponent extends Mixin(Core, Stores, Animations) implements OnInit {

  isSystemOpened = false;

  datasets: {
    gateways: {
      id: string;
      name: string;
      serialNumber: string;
    }[]
  };

  gateway: {
    id: string;
    name: string;
    serialNumber: string;
    status: { id: SystemGatewayStatusEnum, updatedAt: number },
    statusAdditionalInfo?: { cssClass: string, translation: string },
    deployInfo: SystemGatewayDeployInfo
  };

  gatewayStatusEnum = SystemGatewayStatusEnum;

  routeOptions: {
    layoutOptions: {
      addDevice: boolean;
    }
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

    this.datasets = { gateways: [] };

    // this.gateway = { id: null, name: null, serialNumber: null, status: null, statusCssClass: null, deployInfo: null };

    // this.buildBreadcrumbs(this.route.snapshot);

    this.subscriptions.push(
      this.store.system.getSystem$().subscribe(system => {

        this.isSystemOpened = system.id ? true : false;

        this.gatewaysWithUndeployedChanges = 0;

        if (!system.id) {
          this.gateway = { id: null, name: null, serialNumber: null, status: null, deployInfo: null };
        } else {

          this.datasets.gateways = system.gateways.map(g => {

            if (!system.isDirty && g.hasUndeployedChanged) { // verify and increment ready to deploy gateways counter
              this.gatewaysWithUndeployedChanges++;
            }

            return { id: g.id, name: g.name, serialNumber: g.modules.find(m => m.isMaster)?.serialNumber };
          });

          if (system.selectedGateway) {
            this.gateway = {
              id: system.selectedGateway,
              name: this.store.system.getGateway()?.name,
              serialNumber: this.store.system.getMasterModule()?.serialNumber,
              status: this.store.system.getGateway()?.status,
              deployInfo: this.store.system.getGateway()?.deployInfo
            };

            switch (this.gateway.status.id) {
              case SystemGatewayStatusEnum.ONLINE:
                this.gateway.statusAdditionalInfo = { cssClass: 'text-success', translation: 'dictionary.connected' };
                break;
              case SystemGatewayStatusEnum.OFFLINE:
                this.gateway.statusAdditionalInfo = { cssClass: 'text-danger', translation: 'labels.not_connected' };
                break;
              case SystemGatewayStatusEnum.STALE:
                this.gateway.statusAdditionalInfo = { cssClass: 'text-warning', translation: 'labels.missing_historical_data' };
                break;
              default:
                this.gateway.statusAdditionalInfo = { cssClass: '', translation: '' };
                break;
            }

            this.showAddAppDevices = this.store.system.getFieldDevices(system.selectedGateway).length > 0; // Show "add application devices option if gateway contains field devices.

          } else {
            this.gateway = { id: null, name: null, serialNumber: null, status: null, deployInfo: null };
          }
        }

        this.cdr.detectChanges();
      }
      )
    );

    // this.subscriptions.push(
    //   this.router.events.subscribe(event => {
    //     if (event instanceof NavigationEnd) {
    //       this.buildBreadcrumbs(this.route.snapshot);
    //       this.cdr.detectChanges();
    //     }
    //   })
    // );

  }

  // buildBreadcrumbs(route, url: string = '', breadcrumbs: Array<Breadcrumb> = []): Array<Breadcrumb> {
  //   let title = '';
  //   let path = '';
  //   if (route.routeConfig) { // If no routeConfig or no data available, we are on the root path, or with nothing to show.
  //     path = route.routeConfig.path;
  //     if (route.routeConfig.data) {
  //       if (route.routeConfig.data.breadcrumb) {
  //         title = upperFirst(this.translate(route.routeConfig.data.breadcrumb));
  //       }

  //       this.routeOptions.layoutOptions = route.routeConfig.data.layoutOptions ? route.routeConfig.data.layoutOptions : {
  //         addDevice: false
  //       };
  //     }
  //   }

  //   const nextUrl = `${url}${path}/`;
  //   const breadcrumb = {
  //     title: (title ? title : null),
  //     page: (route.firstChild && route.firstChild.data.breadcrumb !== '' ? nextUrl : null) // If no more childs, no Url!
  //   };

  //   const newBreadcrumbs = title ? [...breadcrumbs, breadcrumb] : breadcrumbs; // Only add breadcrumbs with label!

  //   if (route.firstChild) { // If we are not on our current path yet, there will be more children to look after.
  //     return this.buildBreadcrumbs(route.firstChild, nextUrl, newBreadcrumbs);
  //   }
  //   this.routeOptions.title = breadcrumb.title;
  // }


  onGatewaySelected(gateway: string) {
    const routerState = this.router.routerState.snapshot;
    // if already in a gateway tab, redirect to that same tab in the new gateway
    if (routerState.url.includes('/gateways/')) {
      const urlSplitted = routerState.url.split('/');
      this.router.navigateByUrl(`/${this.store.system.getSystem().id}/gateways/${gateway}/${urlSplitted[4]}`).then((result: boolean) => {
        if (result === null || result === true) {
          this.store.system.selectGateway(gateway);
        }
      });
    } else {
      this.router.navigateByUrl(`/${this.store.system.getSystem().id}/gateways/${gateway}`).then((result: boolean) => {
        if (result === null || result === true) {
          this.store.system.selectGateway(gateway);
        }
      });
    }
  }


  onDeployGateway() {

    if (!this.store.system.getSystem().isDirty) {
      this.openDeployGatewaysListModal();
      return;
    }

    this.dialog.open(GenericDialogComponent, {
      panelClass: 'dialog-width-50',
      data: {
        title: this.translate('features.dialogs.save_system_and_deploy.title'),
        message: this.translate('features.dialogs.save_system_and_deploy.message'),
        actions: [
          { id: 'cancel', class: 'btn-cancel', label: upperFirst(this.translate('dictionary.cancel')) },
          { id: 'save', class: 'btn-submit', label: this.translate('labels.save_and_deploy') }
        ],
        allowDismiss: false
      }
    }).afterClosed().pipe(take(1), map(response => response)).toPromise().then(event => {
      if (event === 'save') {
        this.store.system.saveSystem$().pipe(take(1)).subscribe(
          () => {
            this.notification.success(this.translate('messages.notifications.save.success'));
            this.openDeployGatewaysListModal();
          },
          () => {
            this.notification.error(this.translate('messages.notifications.save.error'));
          }
        );
      }
    });

  }

  openDeployGatewaysListModal() {
    const gateway = this.gatewaysWithUndeployedChanges === 0 ? this.gateway.id : null;

    this.dialog.open(DeployGatewaysListModalComponent, {
      panelClass: 'dialog-width-50',
      data: { gateway }
    });
  }

}
