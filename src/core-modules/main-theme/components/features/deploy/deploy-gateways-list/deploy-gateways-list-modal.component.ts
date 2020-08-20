import { Component, OnInit, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { upperFirst } from 'lodash';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { GenericDialogComponent } from '@core-modules/main-theme/components/shared/dialogs/generic-dialog.component';

import { Mixin, Core, Stores, Animations, Forms, Dialogs } from '@app/base';
import { SystemModel, SystemGatewayModel, SystemGatewayStatusEnum } from '@core-modules/stores';

@Component({
  selector: 'app-home-modals-deploy-gateways-list-modal',
  templateUrl: './deploy-gateways-list-modal.component.html',
  styleUrls: ['./deploy-gateways-list-modal.component.scss']
})
export class DeployGatewaysListModalComponent extends Mixin(Core, Stores, Animations, Forms, Dialogs) implements OnInit {

  table = {
    displayedColumns: ['selections', 'gateway', 'additional-modules', 'field-devices', 'application-devices', 'status'],
    dataSource: new MatTableDataSource([] as (SystemGatewayModel & { fieldDevicesNumber: number, applicationDevicesNumber: number })[]),
    selection: new SelectionModel(true, [])
  };

  gatewayStatus = {
    ONLINE: upperFirst(this.translate('dictionary.ready')),
    OFFLINE: this.translate('labels.not_ready'),
    STALE: upperFirst(this.translate('dictionary.ready'))
  };
  GatewayStatusEnum = SystemGatewayStatusEnum;

  contentReady: boolean;
  individualNotes = false;

  deployNotesPreviousData: {
    singleNote: string,
    individualNotes: { gateway: string, note: string }[]
  };

  form: FormGroup;
  get f() { return this.form.controls; }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { gateway: string },
    public dialogRef: MatDialogRef<DeployGatewaysListModalComponent>
  ) { super(); }


  ngOnInit() {

    this.contentReady = false;
    this.loader.show('gateways-list');

    this.deployNotesPreviousData = {
      individualNotes: [],
      singleNote: ''
    };
    this.buildNotesForm();

    let firstPass = true;

    this.subscriptions.push(
      this.store.system.getSystem$().subscribe((system: SystemModel) => {

        this.table.dataSource.data = system.gateways.map((gateway: SystemGatewayModel & { fieldDevicesNumber: number, applicationDevicesNumber: number, deployMessage: string, deployDate: string }) => {

          gateway.fieldDevicesNumber = gateway.fieldDevices.length;
          gateway.applicationDevicesNumber = gateway.fieldDevices.reduce((fieldDeviceAccumulator, fieldDevice) => {
            return fieldDeviceAccumulator + fieldDevice.applicationBindings.reduce((applicationBindingAccumulator, applicationBinding) => applicationBindingAccumulator + applicationBinding.applicationObjects.length, 0);
          }, 0);

          gateway.deployMessage = this.translate('features.deploy.states.' + gateway.deployInfo.message);

          if (gateway.deployInfo.updatedAt) {
            gateway.deployDate = formatDate(new Date(gateway.deployInfo.updatedAt * 1000), this.translate('app.date_formats.short'), this.store.environment.language);
            gateway.deployMessage += ` @ ${gateway.deployDate}`;
          }

          // Gateway cannot be chosen on these conditions.
          if (!this.isRowSelectable(gateway)) { this.table.selection.deselect(gateway); }
          else if (firstPass) { // If not deploying
            if (!this.data.gateway && gateway.hasUndeployedChanged) { // if a gateway wasn't passed and this one has undeployed changes, select it
              this.table.selection.select(gateway);
            } else if (this.data.gateway === gateway.id) { // If a gateway was passed to the dialog, select this one!
              this.table.selection.select(gateway);
            }
          }

          return gateway;

        });

        firstPass = false;

      })
    );

    this.contentReady = true;
    this.loader.hide('gateways-list');


  }

  buildNotesForm() {
    let groups;

    if (this.individualNotes) {
      groups = this.table.selection.selected.map((gateway: SystemGatewayModel) => this.formBuilder.group({
        gateway: gateway.id,
        note: [this.deployNotesPreviousData.individualNotes.find(n => n.gateway === gateway.id)?.note || '', Validators.required]
      }));
    } else {
      groups = [this.formBuilder.group({ gateway: 'all', note: [this.deployNotesPreviousData.singleNote, Validators.required] })];
    }

    this.form = this.formBuilder.group({ notes: new FormArray(groups) });
  }

  getNoteLabel(gateway: string) {
    return gateway !== 'all' ? `${upperFirst(this.translate('dictionary.gateway'))} "${this.table.dataSource.data.find(g => g.id === gateway)?.name}"` : null;
  }

  // Table selections methods.
  isAnySelected() { return this.table.selection.selected.length > 0; }
  isAllSelected() { return this.table.selection.selected.length > 0 && this.table.selection.selected.length === this.table.dataSource.data.filter(g => g.status.id !== this.GatewayStatusEnum.OFFLINE).length; }
  isMasterSelectable() { return this.table.dataSource.data.filter(g => g.status.id !== this.GatewayStatusEnum.OFFLINE).length > 0; }
  isRowSelectable(row: SystemGatewayModel) { return !(row.deployInfo.isDeploying || row.status.id === SystemGatewayStatusEnum.OFFLINE); }

  masterToggle() {
    if (this.isAllSelected()) {
      this.table.selection.clear();
      this.populatePreviousNotes();
      this.individualNotes = false;
    } else {
      this.table.dataSource.data.forEach(row => this.isRowSelectable(row) ? this.table.selection.select(row) : false);
      this.populatePreviousNotes();
    }


    this.buildNotesForm();
  }
  onRowSelect(row: SystemGatewayModel) {

    if (this.isRowSelectable(row)) {
      this.table.selection.toggle(row);
    } else {
      this.table.selection.deselect(row);
    }

    this.populatePreviousNotes();

    if (!this.isAnySelected()) {
      this.individualNotes = false;
    }

    this.buildNotesForm();

    return false; // Mandatory to return false!

  }


  onCancel() {
    this.dialogRef.close(false);
  }

  // Futurology...
  // onOpenDeployInfo(gateway: SystemGatewayModel) {
  //   this.dialog.open(DeployInfoModalComponent, {
  //     panelClass: 'dialog-width-50',
  //     data: { gatewayId: gateway.id }
  //   });
  // }

  onDeploy() {
    (this.form.get('notes') as FormArray).controls.forEach(note => {
      note.get('note').setValue(note.get('note').value.trim());
    });

    if (!this.form.valid) {
      this.formService.showErrors(this.form);
      return;
    }

    const gateways = this.table.selection.selected.map(g => ({
      id: g.id,
      notes: this.individualNotes ? this.form.value.notes.find(n => n.gateway === g.id)?.note : this.form.value.notes[0].note
    }));

    this.store.system.triggerGatewaysDeploys$(gateways).pipe(take(1)).subscribe(
      () => {
        // clear notes
        this.individualNotes = false;
        this.deployNotesPreviousData = {
          individualNotes: this.deployNotesPreviousData.individualNotes.map(n => ({ ...n, note: '' })),
          singleNote: ''
        };
        this.buildNotesForm();
      },
      () => {
        // show error dialog if deploy fails
        this.dialog.open(GenericDialogComponent, {
          panelClass: 'dialog-width-25',
          data: {
            title: this.translate('features.deploy.messages.deploy_failed'),
            message: this.translate('features.deploy.messages.error_trying_deploy'),
            actions: [
              { id: 'close', class: 'btn-cancel', label: upperFirst(this.translate('dictionary.close')) }
            ],
            allowDismiss: false
          }
        });
      }
    );
  }

  populatePreviousNotes() {
    // populate previous data so that the form can load it when the toggle comes back to this state
    if (this.individualNotes) {
      this.form.value.notes.forEach(n => {
        const noteFound = this.deployNotesPreviousData.individualNotes.find(nAux => nAux.gateway === n.gateway);

        // if note is already present in the previousData array, change the note -> else push the note to the array
        if (noteFound) {
          noteFound.note = n.note;
        } else {
          this.deployNotesPreviousData.individualNotes.push(n);
        }
      });
    } else {
      this.deployNotesPreviousData.singleNote = this.form.value.notes[0]?.note;
    }
  }

  toggleIndividualNotes() {
    this.populatePreviousNotes();
    this.individualNotes = !this.individualNotes;

    this.buildNotesForm();
  }

}
