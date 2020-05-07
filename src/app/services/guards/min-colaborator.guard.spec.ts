import { TestBed } from '@angular/core/testing';

import { MinColaboratorGuard } from './min-colaborator.guard';

describe('MinColaboratorGuard', () => {
  let guard: MinColaboratorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MinColaboratorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
