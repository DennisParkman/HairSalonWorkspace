import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UnavailabilityService } from './unavailability.service';

describe('UnavailabilityService', () => {
  //let service: UnavailabilityService;

  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UnavailabilityService]
    }));

  it('should be created', () => {
    const service: UnavailabilityService = TestBed.get(UnavailabilityService);
    expect(service).toBeTruthy();
  });

});
