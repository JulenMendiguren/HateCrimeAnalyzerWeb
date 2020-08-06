import { Component, OnInit } from '@angular/core';
import { IncidentsService } from 'src/app/services/incidents.service';
import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
declare const google: any;

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss'],
})
export class IncidentsComponent implements OnInit {
  reportVersions;
  filterValues = {
    version: 'all',
    startDate: null,
    endDate: null,
    place: {
      enabled: false,
      location: null,
      radius: null,
    },
  };
  map;
  circle;
  markers = [];
  incidents: any = [];

  selectedIncident: number = 0;

  constructor(
    public datepipe: DatePipe,
    private incidentsService: IncidentsService
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.addClickListener();
    this.loadReportVersions();
  }
  setSelectedIncidentObserver() {}

  logFilterValues() {
    console.log(this.filterValues);
  }

  getStringifiedJSON(): string {
    return JSON.stringify(this.incidents[this.selectedIncident], undefined, 4);
  }

  onPageChange(e) {
    console.log(e);
    this.selectedIncident = e.pageIndex;
    this.setMarkerColors();
  }

  initMap(): void {
    const myLatlng = { lat: 43.26358058945173, lng: -2.950877062927873 };
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        zoom: 13,
        center: myLatlng,
        styles: [
          {
            featureType: 'poi.business',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
        ],
      }
    );
  }

  addClickListener() {
    this.map.addListener('click', (event) => {
      if (this.filterValues.place.enabled) {
        if (this.circle) {
          this.circle.setMap(null);
        }
        this.circle = new google.maps.Circle({
          strokeColor: '#3F51B5',
          fillColor: '#3F51B5',
          fillOpacity: 0.2,
          center: event.latLng.toJSON(),
          radius: 500,
          editable: true,
        });
        this.circle.setMap(this.map);
        this.filterValues.place.location = event.latLng.toJSON();
        this.filterValues.place.radius = 500;

        this.circle.addListener('radius_changed', () => {
          this.filterValues.place.radius = Math.floor(this.circle.getRadius());
        });
        this.circle.addListener('center_changed', () => {
          this.filterValues.place.location = this.circle.getCenter().toJSON();
        });
      }
    });
  }

  // if toggle is disabled, deletes saved location and radius
  placeToggleChanged(event) {
    if (!event.checked) {
      this.filterValues.place.location = null;
      this.filterValues.place.radius = null;
      if (this.circle) {
        this.circle.setMap(null);
      }
    }
  }

  setMarkerColors() {
    const green = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    const red = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

    const idOfSelected = this.incidents[this.selectedIncident]._id;

    this.markers.forEach((m) => {
      const color = m._id == idOfSelected ? green : red;
      m.marker.setOptions({ icon: { url: color } });
    });
  }

  placeIncidentMarkers() {
    this.markers.forEach((m) => m.marker.setMap(null));
    this.markers = [];

    this.incidents.forEach((incident) => {
      const latLngString = incident.answers[1].answer.split(',');
      const lat = parseFloat(latLngString[0]);
      const lng = parseFloat(latLngString[1]);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        },
      });

      marker.addListener('click', () => {
        this.selectedIncident = this.incidents.findIndex(
          (i) => i._id == incident._id
        );
        this.setMarkerColors();
      });

      this.markers.push({
        marker,
        _id: incident._id,
      });
    });
  }

  // ---------------
  // API stuff
  // ---------------

  loadReportVersions() {
    this.incidentsService.getReportVersions().subscribe(
      (res) => {
        this.reportVersions = res;
        this.reportVersions.forEach((v) => {
          v.createdAt = this.datepipe.transform(
            v.createdAt,
            'yyyy/MM/dd, HH:mm'
          );
        });
        console.log(this.reportVersions);
      },
      (err) => {
        // this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }

  getFilteredIncidents() {
    this.incidentsService.getFilteredAnswers(this.filterValues).subscribe(
      (res) => {
        console.log(res);
        this.incidents = res;
        this.placeIncidentMarkers();
        this.setMarkerColors();
      },
      (err) => {
        // this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }
}
