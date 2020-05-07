import { TestBed } from '@angular/core/testing';

import { MinAdminGuard } from './min-admin.guard';

describe('MinAdminGuard', () => {
  let guard: MinAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MinAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
