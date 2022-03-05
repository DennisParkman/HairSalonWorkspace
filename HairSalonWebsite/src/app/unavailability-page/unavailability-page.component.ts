import { Component, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { TimePeriod, Unavailability } from '../models/unavailability.model';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { UnavailabilityService } from '../services/unavailability-service/unavailability.service';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
@Component(
{
  selector: 'app-unavailability-page',
  templateUrl: './unavailability-page.component.html',
  styleUrls: ['./unavailability-page.component.scss']
})
export class UnavailabilityPageComponent implements OnInit
{
  @ViewChild(EventCalendarComponent) appCalendar!: EventCalendarComponent
  @ViewChild('addDialog', {static: true}) addDialog: TemplateRef<any>;

  unavailabilities: Unavailability[];
  id: number;
  stylistid: number;
  stylistName: string;
  startDate: Date;
  endDate: Date;
  period: TimePeriod;

  addingUnavailability: boolean = false;
  loadingFinished: boolean = false;
  updatingUnavailability: boolean = false;
  unavailabilityLoading: boolean = true;

  events: CalendarEvent[] = [];
  timePeriods: TimePeriod[];

  constructor(private unavailabilityService: UnavailabilityService, private dialog: MatDialog) { }

  ngOnInit(): void 
  {
    this.timePeriods = [
      TimePeriod.Once,
      TimePeriod.Daily,
      TimePeriod.Weekly,
      TimePeriod.Monthly,
      TimePeriod.Yearly
    ]
    this.unavailabilityService.getUnavailabilities().subscribe(unavailabilities => 
      {
        unavailabilities.forEach(unavailability => 
          {
            unavailability.startDate = new Date(unavailability.startDate);
            unavailability.endDate = new Date(unavailability.endDate);
          });
        this.unavailabilities = unavailabilities; 

        for(let unavailability of this.unavailabilities)
        {
          this.events.push(
            {
              id:unavailability.id,
              start: new Date(unavailability.startDate),
              end: new Date(unavailability.endDate),
              title: unavailability.stylistName + ""
            }
          );
          
        }
        
        this.loadingFinished = true; 
        this.unavailabilityLoading = false;
      }
    );
  }

  cancelAddUnavailability()
  {
    this.addingUnavailability = false;
    this.clearFields();
    this.dialog.closeAll();
  }

  clearFields()
  {
    this.stylistid = 0;
    this.stylistName = "";
    this.startDate = new Date;
    this.endDate = new Date;
    this.period = TimePeriod.Once;
  }

  addUnavailability()
  {
    let unavailability = 
    {
      stylistID: this.stylistid, 
      stylistName: this.stylistName, 
      startDate: this.startDate,
      endDate: this.endDate, 
      period: this.period
    };
    this.unavailabilityService.addUnavailability(unavailability).subscribe(value => 
    {
      //this.unavailabilities.push(value);
      this.addingUnavailability = false;
      console.log(value);
      let event : CalendarEvent = 
      {
        id: value.id, 
        start: new Date(this.startDate), 
        end: new Date(this.endDate), 
        title: this.stylistName
      };
      this.clearFields();
      console.log(event);
      this.unavailabilities.push(value);
      this.appCalendar.updateCalendarEvent(event);
      this.dialog.closeAll();
    });
  }

  deleteUnavailability(event: any)
  {
    
    //reload page
    this.appCalendar.deleteCalendarEvent(event)

    //find unavailability based on calendar event
    let appIndexToDelete = this.unavailabilities.findIndex(x => x.id === event.id);

    // find the Calendar event index
    //let calIndexToDelete = this.events.findIndex(x => x.id === event.id);

    //delete appointent from database
    this.unavailabilityService.deleteUnavailability(this.unavailabilities[appIndexToDelete])

    //remove unavailability from unavailability list
    this.unavailabilities.splice(appIndexToDelete, 1);

    // remove calendar event from events list
    //this.events.splice(calIndexToDelete, 1);

  }

  startUpdateUnavailability(event: any)
  {

    //find unavailability based on calendar event
    let appIndex = this.unavailabilities.findIndex(x => x.id === event.id);
    let unavailabilityToUpdate: Unavailability = this.unavailabilities[appIndex]

    //set fields of current object form
    this.id = event.id;
    this.stylistid =  unavailabilityToUpdate.stylistID;
    this.stylistName = unavailabilityToUpdate.stylistName + "";
    this.startDate = unavailabilityToUpdate.startDate;
    this.endDate = unavailabilityToUpdate.endDate;
    this.period = unavailabilityToUpdate.period; 

    //show update form
    this.updatingUnavailability = true;
    this.dialog.open(this.addDialog);
  }

  updateUnavailability()
  {
    //package fields into an unavailability object
    let unavailability = 
    {
      id: this.id, 
      stylistID: this.stylistid, 
      stylistName: this.stylistName,
      startDate: this.startDate, 
      endDate: this.endDate, 
      period: this.period
    };
    let event = 
    {
      id:this.id, 
      start: new Date(this.startDate), 
      end: new Date(this.endDate), 
      title: this.stylistName
    };
    //call service to update unavailability in database
    this.unavailabilityService.updateUnavailability(unavailability);
    
    let appIndexToUpdate = this.unavailabilities.findIndex(x => x.id === unavailability.id);

    // find the Calendar event index
    //let calIndexToUpdate = this.events.findIndex(x => x.id === unavailability.id);

    //remove unavailability from unavailability list
    this.unavailabilities[appIndexToUpdate] = unavailability;

    //this.events[calIndexToUpdate] = event;

    //clear fields and set booleans
    this.updatingUnavailability = false;
    this.clearFields();
    
    this.appCalendar.updateCalendarEvent(event);
    this.dialog.closeAll();
  }

  cancelUpdateUnavailability()
  {
    this.updatingUnavailability = false;
    this.clearFields();
    this.dialog.closeAll();
  }

  setCreateUnavailability()
  {
    this.addingUnavailability = true;
    this.dialog.open(this.addDialog);
  }

}
