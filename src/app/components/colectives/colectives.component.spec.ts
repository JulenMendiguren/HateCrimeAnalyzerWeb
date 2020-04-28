import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColectivesComponent } from './colectives.component';

describe('ColectivesComponent', () => {
  let component: ColectivesComponent;
  let fixture: ComponentFixture<ColectivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColectivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
