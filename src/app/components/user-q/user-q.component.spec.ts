import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQComponent } from './user-q.component';

describe('UserQComponent', () => {
  let component: UserQComponent;
  let fixture: ComponentFixture<UserQComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
