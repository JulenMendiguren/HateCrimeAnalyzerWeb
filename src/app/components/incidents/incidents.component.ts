import { Component, OnInit } from '@angular/core';
import { IncidentsService } from 'src/app/services/incidents.service';
import { DatePipe } from '@angular/common';
import { locale } from 'moment';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss'],
})
export class IncidentsComponent implements OnInit {
  reportVersions;
  filterValues = { version: 'all', startDate: null, endDate: null };

  constructor(
    public datepipe: DatePipe,
    private incidentsService: IncidentsService
  ) {}
  lat = 51.678418;
  lng = 7.809007;
  ngOnInit(): void {
    this.loadReportVersions();
  }

  logFilterValues() {
    console.log(this.filterValues.startDate.toISOString());
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
        //this.snackBar.open(this.translate.instant('COLECTIVES.snackbar.error'));
        console.log(err);
      }
    );
  }
}
