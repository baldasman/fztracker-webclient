import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { take, debounceTime } from 'rxjs/operators';
import { upperFirst } from 'lodash';

import { Mixin, Core, Stores, Forms, FormGroup, Validators, Animations, Dialogs } from '@app/base';

import { GenericDialogComponent } from '../../../shared/dialogs/generic-dialog.component';

import { EntitiesService } from '../../../../services/entities.service';
import { SystemsService } from '../../../../services/systems.service';

@Component({
  selector: 'app-home-modals-open-system-modal',
  templateUrl: './open-system-modal.component.html'
})
export class OpenSystemModalComponent extends Mixin(Core, Forms, Stores, Animations, Dialogs) implements OnInit {

  contentReady: boolean;

  form: FormGroup;
  get f() { return this.form.controls; }

  datasets: {
    entities: { id: string, name: string }[],
    systems: { id: string, name: string }[]
  };


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public dialogRef: MatDialogRef<OpenSystemModalComponent>,
    private readonly entitiesService: EntitiesService,
    private readonly systemsService: SystemsService
  ) { super(); }

  getSystemsList() {
    this.systemsService.getSystemsList({ entity: this.form.get('entity').value }).pipe(take(1)).subscribe(
      result => {
        this.datasets.systems = result.systems.map(s => ({ id: s.id, name: s.name }));
        if (this.datasets.systems.length === 1) {
          this.form.get('system').setValue(this.datasets.systems[0].id);
        }

        this.contentReady = true;
        this.loader.hide('open-system');
        this.loader.hide('open-system-system-select');
      },
      () => {
        this.datasets.systems = [];
        this.loader.hide('open-system');
        this.loader.hide('open-system-system-select');
      }
    );
  }

  ngOnInit() {
    this.contentReady = false;

    this.loader.show('open-system');
    this.datasets = {
      entities: [],
      systems: []
    };

    this.form = this.formBuilder.group({
      entity: null,
      system: [null, Validators.required]
    });

    this.entitiesService.getEntitiesList().pipe(take(1)).subscribe(
      result => {
        this.datasets.entities = result.entities.map(s => ({ id: s.id, name: s.name }));

        if (this.datasets.entities.length === 1) {
          this.form.get('entity').setValue(this.datasets.entities[0].id);
          this.form.get('entity').disable();
        } else {
          this.contentReady = true;
          this.loader.hide('open-system');
        }
      },
      () => this.loader.hide('open-system')
    );

    this.subscriptions.push(
      // debounceTime to prevent multiple events
      this.form.get('entity').valueChanges.pipe(debounceTime(100)).subscribe(
        () => {
          this.loader.show('open-system-system-select');
          this.getSystemsList();
          this.form.get('system').setValue(null);
        }
      )
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onOpenSystem() {

    if (!this.form.valid) {
      this.formService.showErrors(this.form);
      return;
    }

    if (!this.store.system.getSystem().isDirty) { // If system is pristine.
      this.openSystem();
      return;
    }

    this.dialog.open(GenericDialogComponent, {
      panelClass: 'dialog-width-25',
      data: {
        title: this.translate('labels.open_system'),
        message: this.translate('messages.warnings.system_changes_will_be_lost', { systemName: this.store.system.getSystem().name }),
        actions: [
          { id: 'cancel', class: 'btn-cancel', label: upperFirst(this.translate('dictionary.cancel')) },
          { id: 'discard', class: 'btn-danger border-0', label: this.translate('labels.yes_discard') },
          { id: 'save', class: 'btn-submit', isPrimaryAction: true, label: this.translate('labels.yes_save') }
        ]
      }
    }).afterClosed().subscribe(response => {
      if (response === 'discard') { this.openSystem(); }
      else if (response === 'save') {

        this.showPageLoader();

        this.store.system.saveSystem$().pipe(take(1)).subscribe(
          () => {
            this.notification.success(this.translate('messages.notifications.save.success'));
            this.hidePageLoader();
            this.openSystem();
          },
          () => {
            this.notification.error(this.translate('messages.notifications.save.error'));
            this.hidePageLoader();
          }
        );
      }
    });

  }

  openSystem() {

    this.dialogRef.close(true);
    this.router.navigateByUrl(`/${this.form.get('system').value}`);

    // this.loader.hide('open-system');

    // this.store.system.openSystem$(this.form.get('system').value).pipe(take(1)).subscribe(
    //   result => {
    //     // emit warnings for the deleted GWs
    //     result.gateways.filter(g => g.modules.find(m => m.isDeleted && m.isMaster)).forEach(g => {
    //       const gwMaster = g.modules.find(m => m.isMaster);
    //       this.notification.warning(this.translate('messages.warnings.gateway_deleted', { gatewayName: g.name, gatewaySN: gwMaster.serialNumber }));
    //     });

    //     this.notification.success(this.translate('messages.notifications.system_opened_successfully'));
    //     this.loader.hide('open-system');

    //     this.dialogRef.close(true);
    //     this.router.navigateByUrl(`/${result.id}`);
    //   },
    //   () => {
    //     this.notification.error(this.translate('messages.errors.loading_resource', { resource: this.translate('dictionary.system') }));
    //     this.loader.hide('open-system');
    //   }
    // );

  }

}
