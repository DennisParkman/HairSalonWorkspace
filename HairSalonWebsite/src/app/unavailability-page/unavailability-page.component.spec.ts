import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UnavailabilityPageComponent } from './unavailability-page.component';
import { Unavailability, TimePeriod } from '../models/unavailability.model';
import { Stylist } from '../models/stylist.model';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_SCROLL_STRATEGY_FACTORY } from '@angular/material/dialog';
import { StylistService } from '../services/stylist-service/stylist.service';
import { StylistScheduleService } from '../services/stylist-schedule-service/stylist-schedule.service';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { ActiveToast, Overlay, Toast, ToastrService } from 'ngx-toastr';
import { Component, InjectionToken, TemplateRef } from '@angular/core';
import { UnavailabilityService } from '../services/unavailability-service/unavailability.service';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { CalendarEvent } from 'angular-calendar';
import { MatMenuModule } from '@angular/material/menu';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';

@Component({
  selector: 'app-event-calendar',
  template: '',
})
class eventCalendarComponentFakeClass
{
    deleteCalendarEvent(even: any)
    {

    }
};

describe('UnavailabilityPageComponent', () => {
  let component: UnavailabilityPageComponent;
  let fixture: ComponentFixture<UnavailabilityPageComponent>;

  //service stubs
  let unavailabilityServiceStub: Partial<UnavailabilityService>;
  let stylistServiceStub: Partial<StylistService>;
  let stylistScheduleServiceStub: Partial<StylistScheduleService>;
  let appointmentServiceStub: Partial<AppointmentService>;
  let dialogStub: Partial<MatDialog>;
  let toastrStub: Partial<ToastrService>;
  let httpClientStub: Partial<HttpClient>;

  //make fake lists for stub services
  let fakeUnavailabilityList: Unavailability[] = [];
  let fakeAppointmentList: Appointment[] = [];
  let fakeStylistList: Stylist[] = [];
  let dayinMillSeconds = 86400000

  const MAX_TEST_DATA_COUNT = 5;

  for (let i =1; i<MAX_TEST_DATA_COUNT; i++)
  {
    //set Unavailability list
    let unavailability: Unavailability = {
      id: i,
      stylistID: i,
      stylistName: "Stylist" + i,
      startDate: new Date("April 1"+ i + ", 2022 11:24:00"),
      endDate: new Date("April 1"+ i+1 + ", 2022 12:24:00"),
      period: TimePeriod.Once
    }
    fakeUnavailabilityList.push(unavailability);

    //set Appointment list
    let appointment: Appointment = 
    {
      id: i,
      stylistID: i,
      name: "Temp" + i,
      email: "temp"+i+"@gmail.com" + i,
      phone: "1234567890",
      date: new Date("April 1"+ i + ", 2022 09:24:00"),
      length: 30,
      dateCreated: new Date("April 1"+ (i-1) + ", 2022 09:24:00"),
      description: "I hate web development"
    }
    fakeAppointmentList.push(appointment);

    //set Stylist list
    let stylist: Stylist = {
      id: i,
      name: "Stylist" + i,
      level: ((i + 1) % 5) + 1,
      bio: "I hate web development"
    }
    fakeStylistList.push(stylist);
  }

  //initialize stubs. all of them
  unavailabilityServiceStub = 
  {
    getUnavailabilities(): Observable<Unavailability[]>
    {
      return of(fakeUnavailabilityList);
    },

    addUnavailability(unavailability: Unavailability): Observable<Unavailability>
    {
      console.log("add to addUnavailability");
      unavailability.id = MAX_TEST_DATA_COUNT + 1;
      return of(unavailability);
    },

    deleteUnavailability(unavailability: Unavailability): Observable<Unavailability>
    {
      console.log("delete from addUnavailability");
      return of(unavailability);
    }

  };
  
  stylistServiceStub = 
  {
    getStylists(): Observable<Stylist[]>
    {
      return of(fakeStylistList);
    }
  };

  stylistScheduleServiceStub = 
  {
    //This is not an accurate schedule because it does not account for unavailabilities, however this shoule affect testing
    getStylistSchedule(showUnavailabilities: boolean = false): Observable<CalendarEvent[][]>
    {
        let fakeCal: CalendarEvent[][] = [
          [],
          [
            {id: 1, start: new Date("Mon Apr 11 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Fri Apr 22 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
            {id: 1, start: new Date("Tue Apr 12 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Sat Apr 23 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
            {id: 1, start: new Date("Wed Apr 13 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Mon Apr 25 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
            {id: 1, start: new Date("Thu Apr 14 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Tue Apr 26 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''}
          ],
          [
            {id: 2, start: new Date("Mon Apr 11 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Fri Apr 22 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
            {id: 2, start: new Date("Tue Apr 12 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Sat Apr 23 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
            {id: 2, start: new Date("Wed Apr 13 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Mon Apr 25 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
            {id: 2, start: new Date("Thu Apr 14 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Tue Apr 26 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''}
          ],
          [
            {id: 3, start: new Date("Mon Apr 11 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Fri Apr 22 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
            {id: 3, start: new Date("Tue Apr 12 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Sat Apr 23 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
            {id: 3, start: new Date("Wed Apr 13 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Mon Apr 25 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
            {id: 3, start: new Date("Thu Apr 14 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Tue Apr 26 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''}
          ]
        ]
        return of(fakeCal)
    }
  };

  appointmentServiceStub = 
  {
    getAppointment(): Observable<Appointment[]>
    {
        return of(fakeAppointmentList);
    }
  };

  dialogStub = 
  { 
    open(a: any): any { }
  };

  toastrStub = 
  {
    
    error(message: string) : any //ActiveToast<any>
    {
      // let act: ActiveToast<string> = new Toast()
      // return act
    }
    
  };

  httpClientStub = {};

  

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule(
    {
      declarations: [ UnavailabilityPageComponent],
      imports:
      [
        MatDialogModule,
        MatMenuModule
      ],
      providers: 
      [
        Overlay,
        HttpHandler,
        HttpClient,
        HttpClientModule,
        HttpClientTestingModule,
        {provide: UnavailabilityService, useValue: unavailabilityServiceStub},
        {provide: MatDialog, useValue: dialogStub},
        {provide: StylistService, useValue: stylistServiceStub},
        {provide: StylistScheduleService, useValue: stylistScheduleServiceStub},
        {provide: AppointmentService, useValue: appointmentServiceStub},
        {provide: ToastrService, useValue: toastrStub},
        {provide: HttpClient, useValue: httpClientStub},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => 
  {
    fixture = TestBed.createComponent(UnavailabilityPageComponent);
    component = fixture.componentInstance;
    

    fixture.detectChanges();
  });
  
  /** ~~~~~~~~~~~~~~~~~~~~~~~~~ngOnInit~~~~~~~~~~~~~~~~~~~~~~~~~ **\
   * testing ngOnInit
   * checks enum is set.
   * checks that filteredStylists is the same as stylists.
   */
  it('should initialize', () => 
  {
    expect(component).toBeTruthy();

    //checks enum is set
    let timePeriods: TimePeriod[] = [
      TimePeriod.Once,
      TimePeriod.Daily,
      TimePeriod.Weekly,
      TimePeriod.Monthly,
      TimePeriod.Yearly
    ]

    expect(component.timePeriods)/*.withContext("timePeriods array set")*/.toEqual(timePeriods);
    //                            ^ don' as' stoopit questions
    expect(component.stylists)/*.withContext("stylists array set")*/.toEqual(fakeStylistList);
    expect(component.appointments)/*.withContext("timePeriods array set")*/.toEqual(fakeAppointmentList);
    expect(component.unavailabilities)/*.withContext("timePeriods array set")*/.toEqual(fakeUnavailabilityList);
    //and we'll skip testing fullStylistSchedule for now....
  });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~setStylistIdFromDropdown~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing setStylistIdFromDropdown
   * checks that this.name and this.stylistid are set
   */
  it('should setStylistIdFromDropdown', () => 
  {
    let sty: Stylist = 
    {
      name: "test",
      id: 1,
      level: 5,
      bio: "I hate web development",
      stylistImage: "iAmRealBase64EncodeImage"
    };

    component.setStylistIdFromDropdown(sty);
    expect(component.stylistid)/*.withContext('id should be set')*/.toEqual(1);
    expect(component.stylistName)/*.withContext('id should be set')*/.toEqual("test");
  });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~stylistDropdownDisplay~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * testing stylistDropdownDisplay
   * ensures function returns the stylist name for a non-null stylist object
   * ensures function returns empty string for a null stylist object
   */
   it('should stylistDropdownDisplay', () => 
   {
    let sty: Stylist = 
    {
      name: "Stylist1",
      id: 1,
      level: 5,
      bio: "I hate web development",
      stylistImage: "iAmRealBase64EncodeImage"
    };
    
    let actual = component.stylistDropdownDisplay(sty);
    expect(sty.name)/*.withContext('id should be set')*/.toEqual(actual);
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~showWorkScheduleBy~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * testing showWorkScheduleBy
   * ensures events is empty for no full schedule
   * ensures events is correctly populated for a populated full schedule
   */
   it('should showWorkScheduleBy', () =>
   {
    let fakeEvents: CalendarEvent[] = [
      {id: 1, start: new Date("Mon Apr 11 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Fri Apr 22 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
      {id: 1, start: new Date("Tue Apr 12 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Sat Apr 23 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
      {id: 1, start: new Date("Wed Apr 13 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Mon Apr 25 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''},
      {id: 1, start: new Date("Thu Apr 14 2022 06:00:50 GMT-0400 (Eastern Daylight Time)"), end: new Date("Tue Apr 26 2022 19:00:50 GMT-0400 (Eastern Daylight Time)"), title: ''}
    ]
    component.showWorkScheduleBy(fakeStylistList[0]);
    expect(fakeEvents)/*.withContext('id should be set')*/.toEqual(component.events);
    component.fullStylistSchedule = [];
    fakeEvents = [];
    component.showWorkScheduleBy(fakeStylistList[0]);
    expect(fakeEvents)/*.withContext('id should be set')*/.toEqual(component.events);
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~validateFields~~~~~~~~~~~~~~~~~~~~~~~~~ */

   /**
   * testing validateFields
   * checks a valid unavailability passes
   */
    it('should validate', () => 
    {
      //unavailability attributes for forms
      component.stylistName = 'Stylist1';
      component.startDate = new Date(Date.now());
      component.endDate = new Date(Date.now() + dayinMillSeconds);
      component.period = TimePeriod.Once;
      expect(component.validateFields()).toBeTruthy();
    });

  /**
   * testing validateFields
   * checks fails on no name
   */
   it('should not validate missing name', () => 
   {
      //unavailability attributes for forms
      component.stylistName = '';
      component.startDate = new Date(Date.now());
      component.endDate = new Date(Date.now() + dayinMillSeconds);
      component.period = TimePeriod.Once;
      expect(component.validateFields()).toBeFalsy();
   });
  
  /**
   * testing validateFields
   * checks fails on no start date
   */
   it('should not validate missing start date', () => 
   {
    //unavailability attributes for forms
    component.stylistName = 'Stylist1';
    component.startDate;
    component.endDate = new Date(Date.now() + dayinMillSeconds);
    component.period = TimePeriod.Once;
    expect(component.validateFields()).toBeFalsy();
   });
  
  /**
   * testing validateFields
   * checks fails on no end date
   */
   it('should not validate missing end date', () => 
   {
      //unavailability attributes for forms
      component.stylistName = 'Stylist1';
      component.startDate = new Date(Date.now());
      component.endDate;
      component.period = TimePeriod.Once;
      expect(component.validateFields()).toBeFalsy();
   });
  
  /**
   * testing validateFields
   * checks fails on no period
   */
   it('should not validate missing period', () => 
   {
    //unavailability attributes for forms
    component.stylistName = 'Stylist1';
    component.startDate = new Date(Date.now());
    component.endDate = new Date(Date.now() + dayinMillSeconds);
    component.period;
    expect(component.validateFields()).toBeFalsy();
   });
  
  /**
   * testing validateFields
   * checks fails on end before start
   */
   it('should not validate ending before start', () => 
   {
    //unavailability attributes for forms
    component.stylistName = 'Stylist1';
    component.startDate = new Date(Date.now());
    component.endDate = new Date(Date.now() - dayinMillSeconds);
    component.period = TimePeriod.Once;
    expect(component.validateFields()).toBeFalsy();
   });
  
  /**
   * testing validateFields
   * checks fails on start before now/date created
   */
   it('should not validate starting before now', () => 
   {
    //unavailability attributes for forms
    component.stylistName = 'Stylist1';
    component.startDate = new Date(Date.now() - dayinMillSeconds - dayinMillSeconds);
    component.endDate = new Date(Date.now() + dayinMillSeconds);
    component.period = TimePeriod.Once;
    expect(component.validateFields()).toBeFalsy();
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~clearFields~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing clearFields
   * ensures the fields are cleared
   */
   it('should clear the fields', () => 
   {
    //unavailability attributes for forms
    component.stylistName = 'Stylist1';
    component.startDate = new Date(Date.now());
    component.endDate = new Date(Date.now() + dayinMillSeconds);
    component.period = TimePeriod.Once;
    component.clearFields();
    expect(component.stylistName == '')/*.withContext('id should be set')*/.toBeTruthy();
    expect(component.startDate <= new Date)/*.withContext('id should be set')*/.toBeTruthy(); //use <= since current time keeps advancing as code executes
    expect(component.endDate <= new Date)/*.withContext('id should be set')*/.toBeTruthy(); //use <= since current time keeps advancing as code executes
    expect(component.period == TimePeriod.Once)/*.withContext('id should be set')*/.toBeTruthy(); //apparently this always returns false if component.period is set to anything by Once
    
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~resetDialog~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing resetDialog
   * ensures the fields are cleared
   */
   it('should reset fields', () => 
   {
      component.updatingUnavailability  = true;
      component.addingUnavailability  = true;
      component.resetDialog();
      expect(component.updatingUnavailability)/*.withContext('id should be set')*/.toBeFalsy();
      expect(component.addingUnavailability)/*.withContext('id should be set')*/.toBeFalsy();
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~timePeriodToString~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing timePeriodToString
   * checks that each timeperiod gets converted to its string equivalent
   */
   it('should convert timePeriodToString', () => 
   {
      expect(component.timePeriodToString(TimePeriod.Once))/*.withContext('id should be set')*/.toEqual("Once");
      expect(component.timePeriodToString(TimePeriod.Daily))/*.withContext('id should be set')*/.toEqual("Daily");
      expect(component.timePeriodToString(TimePeriod.Weekly))/*.withContext('id should be set')*/.toEqual("Weekly");
      expect(component.timePeriodToString(TimePeriod.Monthly))/*.withContext('id should be set')*/.toEqual("Monthly");
      expect(component.timePeriodToString(TimePeriod.Yearly))/*.withContext('id should be set')*/.toEqual("Yearly");
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~checkUnavailabilityConflict~~~~~~~~~~~~~~~~~~~~~~~~~ */
  
  /**
   * ensure that an unavailability that conflicts with an appointment returns true
   */
   it('should find a conflict', () => 
   {
      component.appointments = fakeAppointmentList;
      let unavailability: Unavailability = 
      {
        id: 1,
        stylistID: 2,
        stylistName: "Stylist1",
        startDate: new Date("April 12, 2022 08:24:00"),
        endDate: new Date("April 13, 2022 12:24:00"),
        period: TimePeriod.Once
      };

      expect(component.checkUnavailabilityConflict(unavailability))/*.withContext('id should be set')*/.toBeTruthy();
   });

  /**
   * ensure that an unavailability for one stylist does not conflict an appointment for a different stylist
   */
   it('should not find a conflict with a different stylist', () => 
   {
      component.appointments = fakeAppointmentList;
      let unavailability: Unavailability = {
        id: 1,
        stylistID: 1,
        stylistName: "Stylist1",
        startDate: new Date("April 12, 2022 08:24:00"),
        endDate: new Date("April 13, 2022 12:24:00"),
        period: TimePeriod.Once
      }
      expect(component.checkUnavailabilityConflict(unavailability))/*.withContext('id should be set')*/.toBeFalsy();
   });

  /**
   * ensure that an unavailability that does not conflict with any appointment returns false
   */
   it('should not find a conflict', () => 
   {
    component.appointments = fakeAppointmentList;
    let unavailability: Unavailability = {
      id: 1,
      stylistID: 7,
      stylistName: "Stylist1",
      startDate: new Date("April 12, 2022 08:24:00"),
      endDate: new Date("April 13, 2022 12:24:00"),
      period: TimePeriod.Once
    }
    expect(component.checkUnavailabilityConflict(unavailability))/*.withContext('id should be set')*/.toBeFalsy();
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~setCreateUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * check that the fields are populated right
  */
   it('should populate the create form fields', () => 
   {
      let date = new Date();
      //unavailability attributes for forms
      component.stylistName = 'Stylist1';
      component.startDate = date;
      component.endDate = date;
      // component.period = TimePeriod.Weekly;// period not set by setCreateUnavailability
      component.addingUnavailability = false;

      component.setCreateUnavailability(date);

      expect(component.stylistName == '')/*.withContext('id should be set')*/.toBeTruthy();
      expect(component.startDate == date)/*.withContext('id should be set')*/.toBeTruthy();
      expect(component.endDate == date)/*.withContext('id should be set')*/.toBeTruthy();
      expect(component.period == TimePeriod.Once)/*.withContext('id should be set')*/.toBeTruthy();
      expect(component.addingUnavailability)/*.withContext('id should be set')*/.toBeTruthy();

   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~addUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * test that unavailability is added to front-end list and fields are set properly
   * calls to this.stylistScheduleService.refreshStylistScheduleWithUnavailability()
   *  and this.appCalendar.updateFullCalendar() should be tested in their native modules
  */
   it('should add the unavailability', () => 
    {
      component.unavailabilities = fakeUnavailabilityList;

      //set fields
      component.stylistid = 7,
      component.stylistName = "Stylist1",
      component.startDate = new Date(Date.now() + dayinMillSeconds),
      component.endDate = new Date(component.startDate.valueOf() + dayinMillSeconds),
      component.period = TimePeriod.Weekly

      console.log(component.unavailabilities.length);
      //add the unavailability
      component.addUnavailability();
      console.log(component.unavailabilities.length);
      //check the stuff
      expect(component.addingUnavailability).toBeFalsy();
      
      expect(component.unavailabilities.find(x => (x.stylistID == component.stylistid &&
                                                  x.stylistName == component.stylistName &&
                                                  x.startDate == component.startDate &&
                                                  x.endDate == component.endDate &&
                                                  x.period == component.period)))
            .toBeDefined();
      
    });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~deleteUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * test that unavailability is removed from the front-end list and fields are
   * reset properly
   * Does not test methods of external modules
  */
  it('should delete the unavailability', () => 
  {
    component.appCalendar = TestBed.createComponent(eventCalendarComponentFakeClass).componentInstance as EventCalendarComponent;
    let unavailability: Unavailability = 
    {
      id: 1,
      stylistID: 7,
      stylistName: "Stylist1",
      startDate: new Date("April 12, 2022 08:24:00"),
      endDate: new Date("April 13, 2022 12:24:00"),
      period: TimePeriod.Once
    }
    component.unavailabilities = [unavailability];

    let delEvent: CalendarEvent = 
    {
      id: 1,
      start: unavailability.startDate,
      end: unavailability.endDate,
      title: "Unavailable",
      color: {primary: '#8b0000', secondary: '#008b8b'}
    }
    component.events = [delEvent];
    
    component.deleteUnavailability(delEvent);

    expect(component.unavailabilities).toEqual([]);

  });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~startUpdateUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * check that the fields from the right unavailability are loaded and booleans updated
  */
  it('should populate the update form fields', () => 
  {

  });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~updateUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * check that the right unavailability is updated and the fields are cleared
  */
  it('should update the unavailability', () => 
  {

  });
});
