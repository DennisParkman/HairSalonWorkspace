import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StylisthoursService } from './stylisthours.service';

describe('StylisthoursService', () => {
  let service: StylisthoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(StylisthoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
