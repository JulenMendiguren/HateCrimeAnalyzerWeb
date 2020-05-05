import { TestBed } from '@angular/core/testing';

import { ColectivesService } from './colectives.service';

describe('ColectivesService', () => {
  let service: ColectivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColectivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
