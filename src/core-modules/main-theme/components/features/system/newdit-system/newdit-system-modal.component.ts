import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { take } from 'rxjs/operators';
import { upperFirst } from 'lodash';

import { Mixin, Core, Stores, Animations, Forms, FormGroup, Validators } from '@app/base';

import { DialogsService } from '../../../../services/dialogs.service';
import { EntitiesService } from '../../../../services/entities.service';
import { SystemsService } from '../../../../services/systems.service';

import { Timezone } from '../../../../../stores';

@Component({
  selector: 'app-home-modals-newdit-system-modal',
  templateUrl: './newdit-system-modal.component.html'
})
export class NewditSystemModalComponent extends Mixin(Core, Stores, Animations, Forms) implements OnInit {
  public contentReady: boolean;
  public datasets: {
    entities: {
      id: string,
      name: string,
      timezone: string,
      defaultTimezone: string
    }[],
    timezones: Timezone[]
  };
  public title: string;
  public actionButton: string;
  public mapModalOpen: boolean;

  public form: FormGroup;
  get f() { return this.form.controls; }

  @HostListener('window:keyup.esc', ['$event'])
  onKeyUp(e) {
    if (this.mapModalOpen) {
      // if map open - remove event
      e.preventDefault();
      e.stopPropagation();
    } else {
      // if map not open - close modal
      this.dialogRef.close();
    }
  }

  constructor(
    private readonly dialogsService: DialogsService,
    private readonly entitiesService: EntitiesService,
    private readonly systemsService: SystemsService,
    @Inject(MAT_DIALOG_DATA) public data: {
      system: {
        id: string;
        entity: string;
        name: string;
        timezone: string;
        coordinates: { latitude: string; longitude: string };
      }
    },
    public dialogRef: MatDialogRef<NewditSystemModalComponent>
  ) {
    super();
  }

  ngOnInit() {
    this.contentReady = false;
    this.loader.show('create-system');
    this.title = this.data?.system?.id ? this.translate('labels.edit_system') : this.translate('labels.create_new_system');
    this.actionButton = this.data?.system?.id ? upperFirst(this.translate('dictionary.save')) : upperFirst(this.translate('dictionary.create'));
    this.mapModalOpen = false;

    this.datasets = {
      entities: [],
      timezones: this.store.environment.getTimezonesList()
    };

    this.form = this.formBuilder.group({
      name: [this.data?.system?.name || null, [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      entity: [this.data?.system?.entity || null, Validators.required],
      timezone: [this.data?.system?.timezone || null, Validators.required]
    });

    this.form.get('entity').valueChanges.subscribe(entityId => {
      if (!this.data?.system?.timezone) { // only change timezone when not provided yet
        const entity = this.datasets.entities.find(e => e.id === entityId);
        this.form.get('timezone').setValue(entity.defaultTimezone);
      }
    });

    this.entitiesService.getEntitiesList().pipe(take(1)).subscribe(
      result => {
        this.datasets.entities = result.entities;
        if (this.datasets.entities.length === 1 || this.data?.system?.id) {
          this.form.get('entity').setValue(this.data?.system?.entity || this.datasets.entities[0].id);
          this.form.get('entity').disable();
        }
        this.contentReady = true;
        this.loader.hide('create-system');
      },
      () => {
        this.loader.hide('create-system');
      }
    );
  }

  onSave() {
    // trim value of name so that empty spaces are not allowed
    this.form.get('name').setValue(this.form.get('name').value.trim());

    if (!this.form.valid) {
      this.formService.showErrors(this.form);
    } else {
      // verify if is editing
      if (this.data?.system?.id) {
        this.editSystem();
      } else {
        this.createSystem();
      }
    }
  }

  createSystem() {
    // if there is a system, display confirmation modal
    if (this.store.system.getSystem().isDirty) {
      this.dialogsService.openConfirmationDialog({
        title: this.translate('labels.create_new_system'),
        message: this.translate('messages.warnings.system_changes_will_be_lost', { systemName: this.store.system.getSystem().name }),
        confirmText: this.translate('labels.yes_create_new'),
        cancelText: upperFirst(this.translate('dictionary.cancel'))
      }).subscribe(evt => {
        // only override current system if chosen so
        if (evt) {
          this.saveSystem();
        }
      });
    } else {
      this.saveSystem();
    }
  }
  saveSystem() {
    const newSystem = this.form.value;
    newSystem.entity = this.form.get('entity').value;
    newSystem.coordinates = {
      latitude: newSystem.coordinates.latitude?.toString(),
      longitude: newSystem.coordinates.longitude?.toString()
    };

    this.loader.show('create-system');
    this.store.system.newSystem$(newSystem).pipe(take(1)).subscribe(
      result => {
        this.notification.success(this.translate('messages.notifications.create.success'));
        this.loader.hide('create-system');
        this.dialogRef.close(true);
        this.router.navigateByUrl(`/${result.id}`);
      },
      () => {
        this.notification.error(this.translate('messages.notifications.create.error'));
        this.loader.hide('create-system');
      }
    );
  }

  editSystem() {
    const body = this.form.value;
    body.coordinates = {
      latitude: body.coordinates.latitude?.toString(),
      longitude: body.coordinates.longitude?.toString()
    };
    delete body.entity;

    this.loader.show('create-system');
    this.store.system.editSystem$(this.data.system.id, body).pipe(take(1)).subscribe(
      () => {
        this.notification.success(this.translate('messages.notifications.edit.success'));
        this.loader.hide('create-system');
        this.dialogRef.close(true);
      },
      () => {
        this.notification.error(this.translate('messages.notifications.edit.error'));
        this.loader.hide('create-system');
      }
    );
  }

  updateMapStatus(event: { data: { isMapModalOpen: boolean } }) {
    this.mapModalOpen = event.data?.isMapModalOpen || false;
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
