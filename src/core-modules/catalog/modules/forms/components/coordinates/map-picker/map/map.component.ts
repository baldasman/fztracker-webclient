import { Component, OnInit, OnDestroy, NgZone, ElementRef, ViewChild, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MouseEvent } from '@agm/core';

import { MarkerModel } from './models/marker.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
})
export class AppMapComponent implements OnInit, OnDestroy {
  @ViewChild('search') searchElementRef: ElementRef;
  @ContentChild(TemplateRef)
  infoWindowTemplateRef: TemplateRef<any>;

  @Input() markers?: MarkerModel[];
  @Input() zoom?: number;
  @Input() coordinates?: {
    latitude: number,
    longitude: number
  };
  @Input() search?: boolean;
  @Input() dimensions?: {
    height: number,
    width?: number
  };

  @Output() mapEvents = new EventEmitter();

  protected geoCoder;

  protected map: any;

  public form: FormGroup;
  public address: string;
  public contentReady = false;

  get f() { return this.form.controls; }

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    if (!this.markers) {
      this.markers = [];
    }
    if (!this.zoom) {
      this.zoom = 10;
    }
    if (!this.dimensions) {
      this.dimensions = {
        height: 300
      };
    }
    if (this.search === undefined) {
      this.search = true;
    }

    this.form = this.fb.group({
      search: [null]
    });

    this.setInitialLocation();
  }

  mapReady(map) {
    this.map = map;

    this.initSearch();
  }

  initSearch() {
    if (this.search) {
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.searchElementRef.nativeElement);

      // used for searching
      // tslint:disable-next-line:new-parens
      this.geoCoder = new google.maps.Geocoder;

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.coordinates.latitude = place.geometry.location.lat();
          this.coordinates.longitude = place.geometry.location.lng();
          this.zoom = 15;
          this.mapEvents.emit({
            type: 'searchFinished',
            data: {
              coordinates: {
                latitude: this.coordinates.latitude,
                longitude: this.coordinates.longitude
              }
            }
          });
        });
      });
    }
  }

  mapClicked(event: MouseEvent) {
    this.mapEvents.emit({
      type: 'mapClicked',
      data: {
        coordinates: {
          latitude: event.coords.lat,
          longitude: event.coords.lng
        }
      }
    });
  }

  markerDragEnd(marker, event: MouseEvent) {
    this.mapEvents.emit({
      type: 'markerDragged',
      data: {
        marker,
        coordinates: {
          latitude: event.coords.lat,
          longitude: event.coords.lng
        }
      }
    });
  }

  clickedMarker(marker) {
    this.mapEvents.emit({
      type: 'markerClicked',
      data: {
        marker
      }
    });
  }

  // method used to init default location if the user doesn't allow the browser to access its location
  setInitialLocation() {
    if (!this.coordinates) {
      this.coordinates = {
        latitude: 38.7071,
        longitude: -9.13549
      };
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.zoom = 10;
        });
      }
    }
  }

  ngOnDestroy() { }
}
