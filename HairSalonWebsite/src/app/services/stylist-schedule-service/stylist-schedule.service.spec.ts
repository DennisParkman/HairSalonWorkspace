import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CalendarEvent } from 'angular-calendar';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { isMonday } from 'date-fns';
import { Stylist } from 'src/app/models/stylist.model';
import { StylistHours, WeekDay } from 'src/app/models/stylisthours.model';
import { TimePeriod, Unavailability } from 'src/app/models/unavailability.model';

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
    
    const stylistId = 1;

    const mockStylists : Stylist[] = [
        {
            name: "TestStylist",
            level: 5,
            bio: "TestBio",
            id: stylistId
        }
    ];

    let testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setMilliseconds(0);
    while(testDate.getDay() != 0)
    {
        testDate = new Date(testDate.getTime() + (24 * 60 * 60 * 1000));
    }
    // 'testDate' is now the closest future Sunday at midnight

    const mockHours : StylistHours[] = [
        { // Overwrite first half of day
            stylistID: stylistId,
            day: WeekDay.Monday,
            startTime: '10:00',
            endTime: '12:00'
        },
        { // Overwrite last half of day
            stylistID: stylistId,
            day: WeekDay.Tuesday,
            startTime: '10:00',
            endTime: '12:00'
        },
        { // Overwrite full day
            stylistID: stylistId,
            day: WeekDay.Wednesday,
            startTime: '10:00',
            endTime: '12:00'
        },
        { // Overwrite middle of day
            stylistID: stylistId,
            day: WeekDay.Thursday,
            startTime: '10:00',
            endTime: '12:00'
        }
    ];
    let today = new Date();
    today.setHours(0);
    const mockUnavailabilities : Unavailability[] = [
        { // Wipe out all previous hours
            stylistID: stylistId,
            startDate: today,
            endDate: new Date(testDate.getTime() + 1 * (24 * 60 * 60 * 1000)),
            period: TimePeriod.Once
        },
        { // Overwrite first half of day
            stylistID: stylistId,
            startDate: new Date(testDate.getTime() + 1 * (24 * 60 * 60 * 1000) + 9 * (60 * 60 * 1000)),
            endDate: new Date(testDate.getTime() + 1 * (24 * 60 * 60 * 1000) + 11 * (60 * 60 * 1000)),
            period: TimePeriod.Once
        },
        { // Overwrite last half of day
            stylistID: stylistId,
            startDate: new Date(testDate.getTime() + 2 * (24 * 60 * 60 * 1000) + 11 * (60 * 60 * 1000)),
            endDate: new Date(testDate.getTime() + 2 * (24 * 60 * 60 * 1000) + 13 * (60 * 60 * 1000)),
            period: TimePeriod.Once
        },
        { // Overwrite full day
            stylistID: stylistId,
            startDate: new Date(testDate.getTime() + 3 * (24 * 60 * 60 * 1000) + 9 * (60 * 60 * 1000)),
            endDate: new Date(testDate.getTime() + 3 * (24 * 60 * 60 * 1000) + 13 * (60 * 60 * 1000)),
            period: TimePeriod.Once
        },
        { // Overwrite middle of day
            stylistID: stylistId,
            startDate: new Date(testDate.getTime() + 4 * (24 * 60 * 60 * 1000) + 10.5 * (60 * 60 * 1000)),
            endDate: new Date(testDate.getTime() + 4 * (24 * 60 * 60 * 1000) + 11.5 * (60 * 60 * 1000)),
            period: TimePeriod.Once
        },
        { // Wipe out all extra hours
            stylistID: stylistId,
            startDate: new Date(testDate.getTime() + 5 * (24 * 60 * 60 * 1000)),
            endDate: new Date(testDate.getTime() + (400 * 24 * 60 * 60 * 1000)),
            period: TimePeriod.Once
        }
    ];

    service.getStylistSchedule()
      .subscribe(stylistHours => {
        expect(stylistHours).toBeTruthy();
        let currentStylistHours = stylistHours[stylistId];
        expect(currentStylistHours).toBeTruthy();
        // Thursday should be deleted
        expect(currentStylistHours.find(x => { x.start.getDay() == 3 })).toBeUndefined();

        let mondaySchedule = currentStylistHours[0];
        let tuesdaySchedule = currentStylistHours[1];
        let thursdayFirstSchedule = currentStylistHours[2];
        let thursdaySecondSchedule = currentStylistHours[3];
        
        expect(mondaySchedule?.start.getHours()).toBe(11);
        expect(mondaySchedule?.end).toBeTruthy();
        if(mondaySchedule?.end == null)
        {
            return;
        }
        expect(mondaySchedule?.end.getHours()).toBe(12);
        
        expect(tuesdaySchedule?.start.getHours()).toBe(10);
        expect(tuesdaySchedule?.end).toBeTruthy();
        if(tuesdaySchedule?.end == null)
        {
            return;
        }
        expect(tuesdaySchedule?.end.getHours()).toBe(11);

        // Wednesday is deleted
        
        expect(thursdayFirstSchedule?.start.getHours()).toBe(10);
        expect(thursdayFirstSchedule?.end).toBeTruthy();
        if(thursdayFirstSchedule?.end == null)
        {
            return;
        }
        expect(thursdayFirstSchedule?.end.getHours()).toBe(10);
        expect(thursdayFirstSchedule?.end.getMinutes()).toBe(30);

        expect(thursdaySecondSchedule?.start.getHours()).toBe(11);
        expect(thursdaySecondSchedule?.start.getMinutes()).toBe(30);
        expect(thursdaySecondSchedule?.end).toBeTruthy();
        if(thursdaySecondSchedule?.end == null)
        {
            return;
        }
        expect(thursdaySecondSchedule?.end.getHours()).toBe(12);
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
