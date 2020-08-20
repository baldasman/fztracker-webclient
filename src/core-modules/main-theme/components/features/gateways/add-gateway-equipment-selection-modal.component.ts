import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription, interval, timer } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Mixin, Core, Animations, Stores } from '@app/base';
import { GatewaysService, WsTopicsService } from '@core-modules/stores';

@Component({
  selector: 'app-home-modals-add-gateway-equipment-selection-modal',
  templateUrl: './add-gateway-equipment-selection-modal.component.html',
  styleUrls: ['./add-gateway-equipment-selection-modal.component.scss']
})
export class AddGatewayEquipmentSelectionModalComponent extends Mixin(Core, Animations, Stores) implements OnInit, OnDestroy {

  private pageSubscriptions: {
    licenseTopic?: Subscription,
    licenseTimeout?: Subscription,
    timerCountdown?: Subscription;
  } = {};

  timer = {
    timeout: 60000 * 15, // 15 minutes.
    counter: 60 * 15,
    counterFormatted: ''
  };

  pageState: 'EQUIPMENTS' | 'COMMAND' = 'EQUIPMENTS';

  licensingInfo = {
    command: '',
    isCompleted: false,
    isCompletedOk: false,
    message: this.translateService.instant('features.gateway_management.licensing_states.waiting'),
    serialNumber: '',
    labelKey: ''
  };

  gatewayTemplates: { id: string, name: string, imageUrl: string }[];
  selectedGatewayTemplateId = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    private dialogRef: MatDialogRef<AddGatewayEquipmentSelectionModalComponent>,
    private gatewaysService: GatewaysService,
    private wsTopicsService: WsTopicsService
  ) { super(); }


  ngOnInit() {

    this.loader.show('add-gateway-template-selection-loader');

    this.gatewaysService.getGatewayTemplatesList().subscribe(data => {
      this.gatewayTemplates = data;
      if (this.gatewayTemplates.length === 1) { this.selectedGatewayTemplateId = this.gatewayTemplates[0].id; }
    });

    this.loader.hide('add-gateway-template-selection-loader');

  }


  onGatewayTemplateClick(equipmentId: string) {
    this.selectedGatewayTemplateId = this.selectedGatewayTemplateId === equipmentId ? '' : equipmentId;
  }
  onGatewayTemplateDblClick(equipmentId: string) {
    this.selectedGatewayTemplateId = equipmentId;
    this.requestLicense();
  }


  requestLicense() {

    this.loader.show('add-gateway-template-selection-loader');

    const auth = this.store.environment.getAuthenticationInfo();
    const body = {
      user: { auth: auth.user.auth, email: auth.user.email, type: auth.user.type },
      tenant: this.store.environment.ENV.DOMAIN,
      entity: auth.entity.id,
      system: this.store.system.getSystem().id,
      gatewayTemplate: this.selectedGatewayTemplateId
    };
    this.gatewaysService.createLicense(body).subscribe(response => {

      this.licensingInfo.command = response.command;

      this.pageState = 'COMMAND';

      this.loader.hide('add-gateway-template-selection-loader');

      this.loader.show('waiting-for-license-loader');

      // Creates a timer countdown effetc.
      this.pageSubscriptions.timerCountdown = timer(0, 1000).subscribe(() => {
        --this.timer.counter;

        // const hours = Math.floor(this.timer.counter / 3600);
        const minutes = Math.floor((this.timer.counter % 3600) / 60);
        // const seconds = Math.floor(this.timer.counter - minutes * 60);

        this.timer.counterFormatted = `${('00' + minutes).slice(-2)}:${('00' + Math.floor(this.timer.counter - minutes * 60)).slice(-2)}`;
      });

      // Creates a timeout for the entire operation.
      this.pageSubscriptions.licenseTimeout = interval(this.timer.timeout).subscribe(() => {

        this.licensingInfo.isCompleted = true;
        this.licensingInfo.isCompletedOk = false;
        this.licensingInfo.message = this.translate('features.gateway_management.licensing_states.completed_error_timeout');

        this.pageSubscriptions.licenseTopic.unsubscribe();
      });

      // Parse all incoming EDGE/{id} events.
      this.pageSubscriptions.licenseTopic = this.wsTopicsService.observeEdge(response.registrationCode).subscribe(event => {

        this.licensingInfo.isCompleted = event.isCompleted;
        this.licensingInfo.isCompletedOk = event.isCompletedOk;
        this.licensingInfo.message = event.message;
        this.licensingInfo.serialNumber = event.serialNumber;
        this.licensingInfo.labelKey = event.labelKey;

        if (this.licensingInfo.isCompleted) {
          this.pageSubscriptions.licenseTimeout.unsubscribe();
        }

      });

    });

  }


  onCopyToClipboard() {
    this.notification.success(this.translate('messages.informations.copied_to_clipboard'));
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({ serialNumber: this.licensingInfo.serialNumber, labelKey: this.licensingInfo.labelKey });
  }

  ngOnDestroy() {
    if (this.pageSubscriptions.licenseTopic) { this.pageSubscriptions.licenseTopic.unsubscribe(); }
    if (this.pageSubscriptions.licenseTimeout) { this.pageSubscriptions.licenseTimeout.unsubscribe(); }
    if (this.pageSubscriptions.timerCountdown) { this.pageSubscriptions.timerCountdown.unsubscribe(); }
  }

}
