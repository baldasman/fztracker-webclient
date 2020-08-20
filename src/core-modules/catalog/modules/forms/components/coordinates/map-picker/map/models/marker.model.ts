export class MarkerModel {
  latitude: number;
  longitude: number;
  resourceId?: any;
  draggable?: boolean;
  label?: string = null;
  icon?: string = null;

  constructor(marker: {
    latitude: number,
    longitude: number,
    resourceId?: any,
    draggable?: boolean,
    label?: string,
    icon?: string
  }) {
    Object.assign(this, marker);
    if (!marker.draggable) {
      this.draggable = false;
    }
  }

  setCoordinates(coordinates: {
    latitude: number,
    longitude: number
  }) {
    this.latitude = coordinates.latitude;
    this.longitude = coordinates.longitude;
  }
}
