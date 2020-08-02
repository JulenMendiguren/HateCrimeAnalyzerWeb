import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss'],
})
export class IncidentsComponent implements OnInit {
  constructor() {}
  lat = 51.678418;
  lng = 7.809007;
  ngOnInit(): void {}
}
