import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UnavailabilityPageComponent } from './unavailability-page.component';
import { Unavailability, TimePeriod } from '../models/unavailability.model';
import { Stylist } from '../models/stylist.model';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StylistService } from '../services/stylist-service/stylist.service';
import { StylistScheduleService } from '../services/stylist-schedule-service/stylist-schedule.service';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { InjectionToken } from '@angular/core';
import { UnavailabilityService } from '../services/unavailability-service/unavailability.service';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { CalendarEvent } from 'angular-calendar';

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

  //make fake lists for stub services
  let fakeUnavailabilityList: Unavailability[] = [];
  let fakeAppointmentList: Appointment[] = [];
  let fakeStylistList: Stylist[] = [];

  for (let i =0; i>5; i++)
  {
    //set Unavailability list
    let unavailability: Unavailability = {
      id: i,
      stylistID: i,
      stylistName: "Stylist" + i,
      startDate: new Date("April 1"+ i + ", 2022 03:24:00"),
      endDate: new Date("April 1"+ i+1 + ", 2022 03:24:00"),
      period: TimePeriod.Once
    }
    fakeUnavailabilityList.push(unavailability);

    //set Appointment list
    let appointment: Appointment = {
      id: i,
      stylistID: i,
      name: "Temp" + i,
      email: "temp"+i+"@gmail.com" + i,
      phone: "1234567890",
      date: new Date("April 1"+ i + ", 2022 03:24:00"),
      length: 30,
      dateCreated: new Date("April 1"+ i+1 + ", 2022 03:24:00"),
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
    getStylistSchedule(showUnavailabilities: boolean = false): Observable<CalendarEvent[][]>
    {
        let fakeCal: CalendarEvent[][] = []
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

  dialogStub = { };

  toastrStub = { };

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule(
    {
      declarations: [ UnavailabilityPageComponent ],
      imports:
      [
        MatDialogModule
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
        {provide: ToastrService, useValue: toastrStub}
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

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~stylistDropdownFilter~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing stylistDropdownFilter
   * ensures that it returns a properly filtered stylist list
   */
   it('should stylistDropdownFilter', () => 
   {
    let name = ""

    let actual = component.stylistDropdownDisplay(sty);
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~stylistDropdownDisplay~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * testing stylistDropdownDisplay
   * ensures function returns the stylist name for a non-null stylist object
   * ensures function returns empty string for a null stylist object
   */
   it('should stylistDropdownDisplay', () => 
   {
 
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~showWorkScheduleBy~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * testing showWorkScheduleBy
   * ensures events is empty for no full schedule
   * ensures events is correctly populated for a populated full schedule
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~validateFields~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * testing validateFields
   * checks fails on no name
   */
   it('should not validate missing name', () => 
   {
 
   });
  
  /**
   * testing validateFields
   * checks fails on no start date
   */
   it('should not validate missing start date', () => 
   {
 
   });
  
  /**
   * testing validateFields
   * checks fails on no end date
   */
   it('should not validate missing end date', () => 
   {
 
   });
  
  /**
   * testing validateFields
   * checks fails on no period
   */
   it('should not validate missing period', () => 
   {
 
   });
  
  /**
   * testing validateFields
   * checks fails on end before start
   */
   it('should not validate ending before start', () => 
   {
 
   });
  
  /**
   * testing validateFields
   * checks fails on start before now/date created
   */
   it('should not validate starting before now', () => 
   {
 
   });
  
  /**
   * testing validateFields
   * checks a valid unavailability passes
   */
   it('should validate', () => 
   {
 
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~clearFields~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing clearFields
   * ensures the fields are cleared
   */
   it('should clear the fields', () => 
   {
 
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~resetDialog~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing resetDialog
   * ensures the fields are cleared
   */
   it('should reset fields', () => 
   {
 
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~timePeriodToString~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing timePeriodToString
   * checks that each timeperiod gets converted to its string equivalent
   */
   it('should convert timePeriodToString', () => 
   {
 
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~checkUnavailabilityConflict~~~~~~~~~~~~~~~~~~~~~~~~~ */
  
  /**
   * ensure that an unavailability that conflicts with an appointment returns true
   */
   it('should find a conflict', () => 
   {
 
   });

  /**
   * ensure that an unavailability for one stylist does not conflict an appointment for a different stylist
   */
   it('should not find a conflict with a different stylist', () => 
   {
 
   });

  /**
   * ensure that an unavailability that does not conflict with any appointment returns false
   */
   it('should not find a conflict', () => 
   {
 
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~setCreateUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * check that the fields are populated right
  */
   it('should populate the create form fields', () => 
   {
 
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~addUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * test that unavailability is added to front-end list and fields are set properly
   * calls to this.stylistScheduleService.refreshStylistScheduleWithUnavailability()
   *  and this.appCalendar.updateFullCalendar() should be tested in their native modules
  */
   it('should add the unavailability', () => 
   {
 
   });

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~deleteUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * test that unavailability is removed from the front-end list and fields are
   * reset properly
   * Does not test methods of external modules
  */
  it('should delete the unavailability', () => 
  {

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
