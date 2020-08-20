
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Mixin, Forms, FormGroup, Validators, Core, Stores, Animations } from '@app/base';
import { take } from 'rxjs/operators';
import { SystemGatewayModel } from '@core-modules/stores';

@Component({
  selector: 'app-home-modals-delete-gateway-modal.component',
  templateUrl: './delete-gateway-modal.component.html',
  styleUrls: ['./delete-gateway-modal.component.scss'],
  animations: [
    trigger('grow', [
      state('small', style({ height: '0px', visibility: 'hidden', overflow: 'hidden' })),
      state('big', style({ height: '*', overflow: 'hidden' })),
      transition('small <=> big', [
        animate(250)
      ])
    ])
  ]
})
export class DeleteGatewayModalComponent extends Mixin(Core, Forms, Stores, Animations) implements OnInit, OnDestroy {

  public form: FormGroup;
  public isVisible: boolean;
  public gateway: SystemGatewayModel;
  public numberOfFieldDevices: number;
  public numberOfApplicationDevices: number;
  public numberOfResources: number;
  public hasError: boolean;


  get f() { return this.form.controls; }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { gateway: string },
    public dialogRef: MatDialogRef<DeleteGatewayModalComponent>
  ) {
    super();
    this.isVisible = false;
    this.numberOfFieldDevices = 0;
    this.numberOfApplicationDevices = 0;
    this.numberOfResources = 0;
    this.hasError = false;
  }

  deleteGateway() {
    this.store.system.deleteGateway$(this.data.gateway, this.form.value).pipe(take(1)).subscribe(
      () => {
        this.notification.success(this.translate('messages.notifications.delete.success'));
        this.dialogRef.close({ deleted: true });

        if (this.store.system.getSystem().selectedGateway === this.data.gateway) {
          this.store.system.selectGateway(null);
          this.router.navigateByUrl(`/${this.store.system.getSystem().id}`);
        }
      },
      () => {
        this.hasError = true;
      }
    );
  }

  ngOnInit() {
    this.gateway = this.store.system.getGateway(this.data.gateway);
    this.numberOfFieldDevices = this.store.system.getFieldDevices(this.data.gateway).length;
    this.numberOfApplicationDevices = this.store.system.getApplicationBindings(this.data.gateway).length;
    this.numberOfResources = this.numberOfFieldDevices + this.numberOfApplicationDevices;

    this.form = this.formBuilder.group({
      labelKey: [null, Validators.required]
    });

  }

  onClose() {
    this.dialogRef.close();
  }

  onClearError() {
    this.hasError = false;
  }

  toggleGatewayInformation() {
    this.isVisible = !this.isVisible;
  }

  onDelete() {
    if (!this.form.valid) {
      this.formService.showErrors(this.form);
      return;
    }

    this.deleteGateway();

  }

  ngOnDestroy() { }
}
