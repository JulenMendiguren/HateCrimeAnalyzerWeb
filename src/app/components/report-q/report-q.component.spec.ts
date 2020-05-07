import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportQComponent } from './report-q.component';

describe('ReportQComponent', () => {
  let component: ReportQComponent;
  let fixture: ComponentFixture<ReportQComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportQComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
