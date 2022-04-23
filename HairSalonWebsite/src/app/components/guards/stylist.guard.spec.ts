import { TestBed } from '@angular/core/testing';

import { StylistGuard } from './stylist.guard';

describe('AuthGuardGuard', () => {
  let guard: StylistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StylistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
