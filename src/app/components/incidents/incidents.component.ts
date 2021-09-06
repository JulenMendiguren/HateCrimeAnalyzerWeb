import { Component, OnInit } from '@angular/core';
import { IncidentsService } from 'src/app/services/incidents.service';
import { DatePipe } from '@angular/common';
import { Colective } from 'src/app/models/Colective';
import { TranslateService } from '@ngx-translate/core';
import { ColectivesService } from 'src/app/services/colectives.service';
import { LanguageService } from 'src/app/services/language.service';
import { Incident } from 'src/app/models/Incident';
import { FalseLiteral } from 'typescript';
import * as flat from 'flat';
import { cloneDeep } from 'lodash';
import * as Papa from 'papaparse';

declare const google: any;

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss'],
})
export class IncidentsComponent implements OnInit {
  colectives: Colective[];
  reportVersions;
  filterValues = {
    version: 'all',
    startDate: null,
    userCol: '',
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
  incidents: Incident[] = [];

  selectedIncident: number = 0;
  previousFilter: {
    version: string;
    startDate: any;
    userCol: string;
    endDate: any;
    place: { enabled: boolean; location: any; radius: any };
  };

  constructor(
    public datepipe: DatePipe,
    private incidentsService: IncidentsService,
    private languageService: LanguageService,
    private colectivesService: ColectivesService
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.addClickListener();
    this.loadReportVersions();
    this.loadColectives();
  }

  getSelectedLanguage(): string {
    return this.languageService.selected;
  }

  getColectiveString(_id): string {
    const col = this.colectives.find((col) => col._id === _id);
    return col['text_' + this.languageService.selected];
  }

  getDateString(date): string {
    return this.datepipe.transform(date, 'yyyy/MM/dd - HH:mm');
  }

  getQuestionString(_id, isReport: boolean): string {
    const incident = this.incidents[this.selectedIncident];
    let questionString = 'ERROR: Question text not found.';

    if (isReport) {
      const q = incident.questionnaire.questions.find((q) => q._id === _id);
      questionString = q['text_' + this.languageService.selected];
    } else {
      const q = incident.userQuestionnaire.questions.find((q) => q._id === _id);
      questionString = q['text_' + this.languageService.selected];
    }
    return questionString;
  }

  getClosedAnswerString(answerIndex: number, _id, isReport: boolean): string {
    const incident = this.incidents[this.selectedIncident];
    let answerString = 'ERROR: Question answer not found.';
    if (isReport) {
      const q = incident.questionnaire.questions.find((q) => q._id === _id);
      answerString =
        q['possibleAnswers_' + this.languageService.selected][answerIndex];
    } else {
      const q = incident.userQuestionnaire.questions.find((q) => q._id === _id);
      answerString =
        q['possibleAnswers_' + this.languageService.selected][answerIndex];
    }
    return answerString;
  }

  onPageChange(e) {
    console.log(e);
    this.selectedIncident = e.pageIndex;
    this.setMarkerColors();
  }

  initMap(): void {
    const defaultLatLng = { lat: 43.263767354229, lng: -2.951101057843435 };
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        zoom: 13,
        center: defaultLatLng,
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

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.map.panTo(pos);
        },
        () => {
          console.log();
        }
      );
    }
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
      const color = m._id === idOfSelected ? green : red;
      m.marker.setOptions({ icon: { url: color } });
    });
  }

  placeIncidentMarkers() {
    this.markers.forEach((m) => m.marker.setMap(null));
    this.markers = [];

    this.incidents.forEach((incident) => {
      const ans = incident.answers[1];
      const latLngString = ans.answer.split(',');
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

  downloadCsv() {
    //this.previousFilter
    let inc = cloneDeep(this.incidents);

    inc = inc.map((i) => {
      //  Change colId for text
      i.userCol.shift();
      i.userCol = i.userCol.map((colId) => this.getColectiveString(colId));
      i['colectives'] = i.userCol.join(' - ');
      delete i.userCol;
      // Change field name TODO(Incident name?)
      i['incidentID'] = i._id;
      delete i._id;

      // Format date
      i.createdAt = this.getDateString(i.createdAt);

      // Report questions
      i['reportQ'] = i.answers.map((a) => {
        let ansString = a.answer;
        const q = i.questionnaire.questions.find((q) => q._id === a._id);

        if (['yesno', 'radio', 'likert'].includes(a.questionType)) {
          ansString =
            q['possibleAnswers_' + this.languageService.selected][a.answer];
        }

        if (a.questionType === 'multiselect') {
          let aux = [];
          a.answer.forEach((i) => {
            aux.push(q['possibleAnswers_' + this.languageService.selected][i]);
          });
          ansString = aux.join(', ');
        }

        if (a.questionType === 'datetime') {
          ansString = this.getDateString(a.answer);
        }

        return { [q['text_' + this.languageService.selected]]: ansString };
      });

      // User questions
      i['userQ'] = i.userAnswers.map((a) => {
        let ansString = a.answer;
        const q = i.userQuestionnaire.questions.find((q) => q._id === a._id);
        if (['yesno', 'radio', 'likert'].includes(a.questionType)) {
          ansString =
            q['possibleAnswers_' + this.languageService.selected][a.answer];
        }
        if (a.questionType === 'datetime') {
          ansString = this.getDateString(a.answer);
        }

        if (a.questionType === 'multiselect') {
          let aux = [];
          a.answer.forEach((i) => {
            aux.push(q['possibleAnswers_' + this.languageService.selected][i]);
          });
          ansString = aux.join(', ');
        }

        if (a.questionType === 'colective') {
          ansString = '';
          a.answer.forEach((col, index) => {
            if (col !== 'all') {
              ansString += this.getColectiveString(col);
              if (index + 1 < a.answer.length) {
                ansString += ' | ';
              }
            }
          });
        }

        return { [q['text_' + this.languageService.selected]]: ansString };
      });

      delete i.questionnaire;
      delete i.userQuestionnaire;
      delete i.answers;
      delete i.userAnswers;

      return i;
    });

    const flattened = inc.map((i) => flat(i));

    const csvString =
      'data:text/csv;charset=utf-8,' +
      Papa.unparse(flattened, { quotes: true });

    var encodedUri = encodeURI(csvString);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'incidents.csv');
    document.body.appendChild(link);

    link.click();
  }

  // ---------------
  // API stuff
  // ---------------

  loadReportVersions() {
    this.incidentsService.getReportVersions().subscribe(
      (res) => {
        this.reportVersions = res;
        this.reportVersions.forEach((v) => {
          v.createdAt = this.getDateString(v.createdAt);
        });
      },
      (err) => {
        // this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }

  getFilteredIncidents() {
    this.previousFilter = this.filterValues;
    this.incidentsService.getFilteredAnswers(this.filterValues).subscribe(
      (res) => {
        this.incidents = res as Incident[];
        this.incidents = this.incidents.reverse();
        if (this.incidents.length > 0) {
          this.placeIncidentMarkers();
          this.setMarkerColors();
        }
      },
      (err) => {
        // this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }

  loadColectives() {
    this.colectivesService.getAllColectives().subscribe(
      (res) => {
        this.colectives = res;
      },
      (err) => {
        //this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }
}
