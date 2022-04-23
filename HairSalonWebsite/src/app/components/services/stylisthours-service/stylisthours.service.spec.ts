import { TestBed } from '@angular/core/testing';

import { StylisthoursService } from './stylisthours.service';

describe('StylisthoursService', () => {
  let service: StylisthoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StylisthoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
