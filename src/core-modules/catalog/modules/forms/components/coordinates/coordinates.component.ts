import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, Input, ChangeDetectorRef, DoCheck, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { MapPickerComponent } from './map-picker/map-picker.component';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'catalog-forms-coordinates',
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoordinatesComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {

  @Input() coordinates: {
    latitude: string | number,
    longitude: string | number
  };
  @Input() required: boolean;
  @Input() form: FormGroup;

  @Output() mapStateEvent = new EventEmitter<{ data: { isMapModalOpen: boolean } }>();

  // tslint:disable-next-line: no-string-literal
  get f() { return this.form.get('coordinates')['controls']; }

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private formsService: FormsService
  ) { }

  ngOnInit() {
    this.coordinates = { latitude: this.coordinates?.latitude || null, longitude: this.coordinates?.longitude || null };

    this.form.addControl('coordinates', this.fb.group({
      latitude: [this.coordinates.latitude, this.required ? Validators.required : null],
      longitude: [this.coordinates.longitude, this.required ? Validators.required : null]
    }));
  }

  ngDoCheck() {

    if (this.form.get('coordinates').touched &&
      (this.form.get('coordinates').get('latitude').errors?.required || this.form.get('coordinates').get('longitude').errors?.required)) {
      this.formsService.showErrors(this.form.get('coordinates') as FormGroup);
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit() { }

  openMapPicker() {
    const dialogRef = this.dialog.open(MapPickerComponent, {
      panelClass: 'dialog-width-50',
      data: {
        latitude: +this.form.get('coordinates').get('latitude').value,
        longitude: +this.form.get('coordinates').get('longitude').value,
        draggable: true
      }
    });

    dialogRef.afterOpened().pipe(take(1)).subscribe(() => {
      this.mapStateEvent.emit({ data: { isMapModalOpen: true } });
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.form.get('coordinates').get('latitude').setValue(result.latitude);
        this.form.get('coordinates').get('longitude').setValue(result.longitude);
        this.cdr.detectChanges();
      }
      this.mapStateEvent.emit({ data: { isMapModalOpen: false } });
    });
  }

  ngOnDestroy() { }

}
