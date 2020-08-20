import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MarkerModel } from './map/models/marker.model';

export interface DialogData {
  id?: string;
}

@Component({
  selector: 'catalog-forms-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.scss']
})
export class MapPickerComponent implements OnInit {

  public markers: MarkerModel[];
  public mapCoordinates: {
    latitude: number,
    longitude: number
  };
  public mapDimensions = {
    height: 400
  };

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      latitude: number,
      longitude: number,
      draggable: boolean
    },
    public dialogRef: MatDialogRef<MapPickerComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    if (this.data.latitude && this.data.longitude) {
      this.mapCoordinates = {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      };
    }

    this.markers = [new MarkerModel({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      resourceId: 1,
      icon: this.getMarkerIcon(),
      draggable: this.data.draggable
    })];
  }

  getMarkerIcon() {
    return 'assets/catalog/map/marker.png';
  }

  onMapEvent(event) {
    switch (event.type) {
      case 'mapClicked':
      case 'markerDragged':
      case 'searchFinished':
        this.updateMarkerCoordinates(event.data.coordinates);
        break;
      default:
        break;
    }
  }

  updateMarkerCoordinates(coordinates) {
    this.markers[0].setCoordinates(coordinates);
  }

  dismiss() {
    this.dialogRef.close();
  }

  onSave() {
    const data = this.markers[0].latitude && this.markers[0].longitude ? { latitude: this.markers[0].latitude, longitude: this.markers[0].longitude } : null;
    this.dialogRef.close(data);
  }

}
