import { Component, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { TimePeriod, Unavailability } from '../models/unavailability.model';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { UnavailabilityService } from '../services/unavailability-service/unavailability.service';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';
import { forkJoin, map, Observable, startWith, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Stylist } from '../models/stylist.model';
import { StylistService } from '../services/stylist-service/stylist.service';

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
  stylists: Stylist[]; //an array of stylists used to get id-name pairs from the stylists for the dropdown menu

  //unavailability attributes for forms
  id: number;
  stylistid: number;
  stylistName: string;
  startDate: Date;
  endDate: Date;
  period: TimePeriod;

  //form control for dropdown
  stylistIDControl = new FormControl();
  //filter observable for dropdown
  filteredStylists: Observable<Stylist[]>;

  //booleans to display and hide forms on the unavailabilities page
  loadingFinished: boolean = false; // boolean for displaying page
  unavailabilityLoading: boolean = true; // boolean to show unavailabilities are being loaded from the backend
  updatingUnavailability: boolean = false;
  addingUnavailability: boolean = false;
  
  events: CalendarEvent[] = []; //array to populate all unavailabilities on the calendar
  timePeriods: TimePeriod[]; //array of unavailabilities serviced from the backend

  constructor(private unavailabilityService: UnavailabilityService, private stylistService: StylistService, private dialog: MatDialog) { }

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

    //forkjoin call to stylists and unavailabilities database tables so they happen correctly
    forkJoin(
      {
        //call unavailabilities service to load all unavailabilities from the database
        unavailabilities: this.unavailabilityService.getUnavailabilities(),
        //call service to load all stylists from the database
        stylists: this.stylistService.getStylists()
      }).subscribe(({unavailabilities, stylists}) => 
      {
        //load all unavailabilities into the unavailabilities array
        unavailabilities.forEach(unavailability => 
          {
            unavailability.startDate = new Date(unavailability.startDate);
            unavailability.endDate = new Date(unavailability.endDate);
          });
        this.unavailabilities = unavailabilities; //save the list of unavailabilities

        this.stylists = stylists; //save the stylist list
        
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

        //set up the dropdown filter
        this.filteredStylists = this.stylistIDControl.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.name)),
          map(name => (name ? this.stylistDropdownFilter(name) : this.stylists.slice()))
        )
        
        // display the page and show that unavailabilities are done loading
        this.loadingFinished = true; 
        this.unavailabilityLoading = false;
      });
  }
  /**
   * Function that accepts enum TimePeriod and returns it in the form of string
   * @param p enum timeperiod
   * @returns timeperiod in string
   */
  timePeriodToString(p: TimePeriod): string
  {
    return Unavailability.timePeriodToString(p);
  }

  /**
   * helper function for ngOnInit to filter the stylist list by an entered stylist name
   */
   private stylistDropdownFilter(name: string): Stylist[]
   {
     const filterValue = name.toLowerCase();
 
     return this.stylists.filter(stylist => stylist.name.toLowerCase().includes(filterValue));
   }
 
   /**
    * event method that sets the form stylistid field
    * @param event the event that was fired
    */
   setStylistIdFromDropdown(stylist: any)
   {
     console.log(stylist); //debug
     this.stylistid = stylist.id;
     this.stylistName = stylist.name;
   }
 
   /** 
    * @param stylist the stylist whose name should be displayed
    * @returns the name of the stylist
    */
   stylistDropdownDisplay(stylist: Stylist): string
   {
     //debug; so selectionChange fires too frequently, 
     //because I had it in a mat-select tag, which it
     //shouldn't have; put the change event on the mat-option
     console.log(stylist); 
     if(stylist != null && stylist.name != null && stylist.name != '')
     {
       return stylist.name;
     }
     else
     {
       return '';
     }
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
    this.stylistIDControl.reset(); //clear the dropdown value
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
    this.stylistIDControl.setValue(this.stylists.find(stylist => stylist.id == this.stylistid)); //autopopulate the dropdown with the stylist
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
    
    //find index of unavailability to change and replace existing information in unavailability list
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
  setCreateUnavailability()
  {
    this.resetDialog();
    this.addingUnavailability = true;
    this.dialog.open(this.formDialog);
  }

  /**
   * function to reset the dialog box
   */
  resetDialog() 
  {
    this.updatingUnavailability = false;
    this.addingUnavailability = false;
    this.clearFields();
  }
}
