import { TestBed } from '@angular/core/testing';

import { MinResearcherGuard } from './min-researcher.guard';

describe('MinResearcherGuard', () => {
  let guard: MinResearcherGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MinResearcherGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
