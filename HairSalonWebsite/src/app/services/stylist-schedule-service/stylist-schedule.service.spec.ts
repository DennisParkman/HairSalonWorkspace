import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CalendarEvent } from 'angular-calendar';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { Stylist } from 'src/app/models/stylist.model';
import { StylistHours } from 'src/app/models/stylisthours.model';
import { Unavailability } from 'src/app/models/unavailability.model';

import { StylistScheduleService } from './stylist-schedule.service';

describe('StylistScheduleService', () => {
  let service: StylistScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(StylistScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('', () => {
    let http = TestBed.inject(HttpClientTestingModule);

  });

  it('returned Observable should match the right data', () => {
    const mockStylists : Stylist[] = [
        {
            name: "TestStylist",
            level: 5,
            bio: "TestBio",
            id: 1
        }
    ];
    const mockHours : StylistHours[] = [
        { // Overwrite first half of day
            
        },
        { // Overwrite last half of day

        },
        { // Overwrite full day

        },
        { // Overwrite middle of day

        }
    ];
    const mockUnavailabilities : Unavailability[] = [
        { // Overwrite first half of day

        },
        { // Overwrite last half of day

        },
        { // Overwrite full day

        },
        { // Overwrite middle of day

        }
    ];

    service.getStylistSchedule()
      .subscribe(courseData => {
        expect(courseData).toBeNull();
      });

    const req1 = TestBed.inject(HttpTestingController).expectOne('http://localhost:63235/Unavailability');
    expect(req1.request.method).toEqual('GET');

    const req2 = TestBed.inject(HttpTestingController).expectOne('http://localhost:63235/StylistHours');
    expect(req2.request.method).toEqual('GET');

    const req3 = TestBed.inject(HttpTestingController).expectOne('http://localhost:63235/Stylist');
    expect(req3.request.method).toEqual('GET');

    req1.flush(mockUnavailabilities);
    req2.flush(mockHours);
    req3.flush(mockStylists);
  });
});
