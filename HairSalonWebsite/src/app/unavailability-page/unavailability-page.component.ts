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
  //Decorator to mark appCalendar as a ViewChild which allows for information to passed between components
  @ViewChild(EventCalendarComponent) appCalendar!: EventCalendarComponent
  @ViewChild('formDialog', {static: true}) formDialog: TemplateRef<any>; //tag used for the add and update forms

  unavailabilities: Unavailability[]; //list of unavailabilities

  //unavailability attributes for forms
  id: number;
  stylistid: number;
  stylistName: string;
  startDate: Date;
  endDate: Date;
  period: TimePeriod;

  //booleans to display and hide forms on the unavailabilities page
  loadingFinished: boolean = false; // boolean for displaying page
  unavailabilityLoading: boolean = true; // boolean to show unavailabilities are being loaded from the backend
  updatingUnavailability: boolean = false;
  addingUnavailability: boolean = false;
  
  events: CalendarEvent[] = []; //array to populate all unavailabilities on the calendar
  timePeriods: TimePeriod[]; //array of unavailabilities serviced from the backend

  constructor(private unavailabilityService: UnavailabilityService, private dialog: MatDialog) { }

  /**
   * On loading page, all unavailabilities on the database are loaded in and put into the event calendar array
   * and the unavailabilities array
   */
  ngOnInit(): void 
  {
    // set enumerable values for time period field
    this.timePeriods = [
      TimePeriod.Once,
      TimePeriod.Daily,
      TimePeriod.Weekly,
      TimePeriod.Monthly,
      TimePeriod.Yearly
    ]
    //call unavailabilities service to load all unavailabilities from the database
    this.unavailabilityService.getUnavailabilities().subscribe(unavailabilities => 
      {
        //load all unavailabilities into the unavailabilities array
        unavailabilities.forEach(unavailability => 
          {
            unavailability.startDate = new Date(unavailability.startDate);
            unavailability.endDate = new Date(unavailability.endDate);
          });
        this.unavailabilities = unavailabilities; 
        
        //load unavailability id, dates, and stylist name for each appointment into the calendar array
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
        
        // display the page and show that unavailabilities are done loading
        this.loadingFinished = true; 
        this.unavailabilityLoading = false;
      }
    );
  }

  timePeriodToString(p: TimePeriod): string
  {
    return Unavailability.timePeriodToString(p);
  }

  /**
   * Function to hide the the add unavailability field
   */
  closeDialog()
  {
    this.resetDialog();
    this.dialog.closeAll(); //closes dialog boxes
  }

  /**
   * function to clear form fields
   */
  clearFields()
  {
    this.stylistid = 0;
    this.stylistName = "";
    this.startDate = new Date;
    this.endDate = new Date;
    this.period = TimePeriod.Once;
  }

  /**
   * function to add a new unavailability to the database and front end lists
   */
  addUnavailability()
  {
    console.log(this.period); //debug
    //create unavailability variable to store form fields
    let unavailability = 
    {
      stylistID: this.stylistid, 
      stylistName: this.stylistName, 
      startDate: this.startDate,
      endDate: this.endDate, 
      period: this.period
    };

    //call unavailability service to add unavailability to database
    this.unavailabilityService.addUnavailability(unavailability).subscribe(value => 
    {
      this.addingUnavailability = false; //hide add unavailability form

      //create calendar event to add to event list
      let event : CalendarEvent = 
      {
        id: value.id, 
        start: new Date(this.startDate), 
        end: new Date(this.endDate), 
        title: this.stylistName
      };
      this.clearFields(); //clear form fields
      this.unavailabilities.push(value); //push unavailability to unavailability list

      //call calendar event component function to reload event list with new item
      this.appCalendar.updateCalendarEvent(event);
      this.dialog.closeAll(); //close dialog box
    });
  }

  /**
   * Function to delete an unavailability from the database and from the front end lists
   * @param event : event to be deleted
   */
  deleteUnavailability(event: any)
  {
    //reload page
    this.appCalendar.deleteCalendarEvent(event)

    //find unavailability based on calendar event
    let appIndexToDelete = this.unavailabilities.findIndex(x => x.id === event.id);

    //delete appointent from database
    this.unavailabilityService.deleteUnavailability(this.unavailabilities[appIndexToDelete])

    //remove unavailability from unavailability list
    this.unavailabilities.splice(appIndexToDelete, 1);
  }

  /**
   * Function to show update unavailability form and set all form fields
   * @param event : object to be updated
   */
  startUpdateUnavailability(event: any)
  {
    this.resetDialog();

    //find unavailability based on calendar event
    let appIndex = this.unavailabilities.findIndex(x => x.id === event.id);
    let unavailabilityToUpdate: Unavailability = this.unavailabilities[appIndex]

    console.log(unavailabilityToUpdate); //debug

    //set fields of current object form
    this.id = event.id;
    this.stylistid =  unavailabilityToUpdate.stylistID;
    this.stylistName = unavailabilityToUpdate.stylistName + "";
    this.startDate = unavailabilityToUpdate.startDate;
    this.endDate = unavailabilityToUpdate.endDate;
    this.period = unavailabilityToUpdate.period; 

    //show update form
    this.updatingUnavailability = true;
    this.dialog.open(this.formDialog);
  }

  /**
   * Function to update database with changed appointment information and update front end list 
   * with new information
   */
  updateUnavailability()
  {
    //package fields into an unavailability object
    let unavailability : Unavailability = 
    {
      id: this.id, 
      stylistID: this.stylistid, 
      stylistName: this.stylistName,
      startDate: this.startDate, 
      endDate: this.endDate, 
      period: this.period
    };

    //create a calendar event from unavailability object
    let event = 
    {
      id: this.id, 
      start: new Date(this.startDate), 
      end: new Date(this.endDate), 
      title: this.stylistName
    };

    //call service to update unavailability in database
    this.unavailabilityService.updateUnavailability(unavailability);

    //find index of appoinment to change and replace existing information in appoinment list
    let appIndexToUpdate = this.unavailabilities.findIndex(x => x.id === unavailability.id);
    this.unavailabilities[appIndexToUpdate] = unavailability;

    //clear fields and set booleans
    this.updatingUnavailability = false;
    this.clearFields();
    
    //reload calendar view and close dialog box
    this.appCalendar.updateCalendarEvent(event);
    this.dialog.closeAll();
  }

  /**
   * function to show create form from dialog box of events
   */
  setCreateUnavailability(date: Date = new Date())
  {
    this.resetDialog();
    this.startDate = date;
    this.endDate = date;
    this.addingUnavailability = true;
    this.dialog.open(this.formDialog);
  }


  resetDialog() {
    this.updatingUnavailability = false;
    this.addingUnavailability = false;
    this.clearFields();
  }
}
