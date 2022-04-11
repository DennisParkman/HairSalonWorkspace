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
import { StylistScheduleService } from '../services/stylist-schedule-service/stylist-schedule.service';
import { ToastrService } from 'ngx-toastr';
import { UserRole } from '../models/user.model';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { Appointment } from '../models/appointment.model';

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
    appointments: Appointment[]; //list of appointments
    stylists: Stylist[]; //an array of stylists used to get id-name pairs from the stylists for the dropdown menu
    events: CalendarEvent[] = []; //array to populate all unavailabilities on the calendar
    fullStylistSchedule: CalendarEvent[][] = []; //2d array of of calendar events indexed at the stylist's id
    timePeriods: TimePeriod[]; //array of unavailabilities serviced from the backend

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

    constructor(private unavailabilityService: UnavailabilityService, 
                private stylistService: StylistService,
                private stylistScheduleService:  StylistScheduleService,
                private appointmentService: AppointmentService,
                private dialog: MatDialog, 
                private toastr: ToastrService) { }

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
          unavailabilities: this.unavailabilityService.getUnavailabilities(), //call unavailabilities service to load all unavailabilities from the database
          appointments: this.appointmentService.getAppointment(), //call unavailabilities service to load all unavailabilities from the database
          stylists: this.stylistService.getStylists(), //call service to load all stylists from the database
          fullStylistSchedule: this.stylistScheduleService.getStylistSchedule(true), //get full stylist work schedule
        }).subscribe(({unavailabilities, stylists, appointments, fullStylistSchedule}) => 
        {

            console.log(fullStylistSchedule);

          //load all unavailabilities into the unavailabilities array
          unavailabilities.forEach(unavailability => 
            {
              unavailability.startDate = new Date(unavailability.startDate);
              unavailability.endDate = new Date(unavailability.endDate);
            });
          this.unavailabilities = unavailabilities; //save the list of unavailabilities
  
          //load all appointments into the appointments array
          appointments.forEach(appointments => 
            {
              appointments.date = new Date(appointments.date);
              appointments.dateCreated = new Date(appointments.dateCreated);
            });
          this.appointments = appointments; //save the list of appointments
  
          this.stylists = stylists; //save the stylist list
          this.fullStylistSchedule = fullStylistSchedule; //load full work schedule
          
          ////add work schedule to events list to be shown
          this.showScheduleBy(stylists[0])
          
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

    /*Stylist Dropdown and Event Methods */

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
     * helper function for ngOnInit to filter the stylist list by an entered stylist name
     */
    private stylistDropdownFilter(name: string): Stylist[]
    {
        const filterValue = name.toLowerCase();
        return this.stylists.filter(stylist => stylist.name.toLowerCase().includes(filterValue));
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
     * 
     * @param stylist 
     */
    showScheduleBy(stylist: Stylist)
    {
        this.events = [];
        if(stylist.id == null)
        {
            return;
        }
        for (let i: number = 0, index: number = stylist.id; i < this.fullStylistSchedule[index].length; i++) 
        {
            this.events.push(this.fullStylistSchedule[index][i]); 
        }
    }

    /* Functions surrounding form operations */

    /**
     * Validate fields before updating / creating unavailability
     */
    validateFields() : boolean
    {
        let valid = true;
        let startDateValue = new Date(this.startDate).valueOf();
        let endDateValue = new Date(this.endDate).valueOf();

        if(this.stylistName == null || this.stylistName == "")
        {
        valid = false;
        this.toastr.error("Stylist Name is required");
        }
        else if(this.startDate == null)
        {
        valid = false;
        this.toastr.error("Start Date is required");
        }
        else if(this.endDate == null)
        {
        valid = false;
        this.toastr.error("End Date is required");
        }
        else if(this.period == null)
        {
        valid = false;
        this.toastr.error("Period is required");
        }
        else if(startDateValue > endDateValue)
        {
        valid = false;
        this.toastr.warning("Start date after end date")
        }
        else if(new Date(this.startDate).getTime() < Date.now() - (24 * 60 * 60 * 1000))
        {
        valid = false;
        this.toastr.warning("Start date too early")
        }

        return valid;
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
     * function to reset the dialog box
     */
     resetDialog() 
     {
        this.updatingUnavailability = false;
        this.addingUnavailability = false;
        this.clearFields();
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
     * Function to check unavailability conflicts from a given unavailability. Returns either true or false, if the 
     * unavailability given does or does not conflict.
     * @param unavailability : unavailability to validate
     * @returns returns true if there is a confilct, false if there is no conflicts
     */
    checkUnavailabilityConflict(unavailability: Unavailability)
    {
        //check for conflicts with appointments
        for(let i = 0; i<this.appointments.length; i++)
        {
            // check if stylist has appointmens in list and that the appointment date falls between the start and end date of the 
            if(this.appointments[i].stylistID === unavailability.stylistID && 
                unavailability.startDate <= this.appointments[i].date && 
                this.appointments[i].date <= unavailability.endDate)
            {
                // Add call to display error message for conflict
                this.toastr.error("Unavailability " + unavailability.startDate + " to " + unavailability.endDate + " conflicts with\n"
                                    + "appointment " + this.appointments[i].date);
                
                // Print unavailability range conflict, return to cancel adding the unavailability entry.
                console.log("Unavailability " + unavailability.startDate + " to " + unavailability.endDate + " conflicts with\n"
                                + "appointment " + this.appointments[i].date);
                                
                return true;
            }
        }
        return false;
    }


    /* CRUD Functions for Unavaliablities */

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

    /**
     * function to add a new unavailability to the database and front end lists
     */
    addUnavailability()
    {
        if(!this.validateFields())
        {
            return;
        }

        //create unavailability variable to store form fields
        let unavailability : Unavailability = 
        {
            stylistID: this.stylistid, 
            stylistName: this.stylistName, 
            startDate: this.startDate,
            endDate: this.endDate, 
            period: this.period
        };
        
        // Check for unavailability conflicts.
        var doesConflict = this.checkUnavailabilityConflict(unavailability);
        if(doesConflict)
        {
            return;
        }

        //call unavailability service to add unavailability to database
        this.unavailabilityService.addUnavailability(unavailability).subscribe(value => 
        {
            this.addingUnavailability = false; //hide add unavailability form

            this.unavailabilities.push(value); //push unavailability to unavailability list

            // Update with service
            // Update calendar

            this.dialog.closeAll(); //close dialog box

            this.stylistScheduleService.refreshStylistScheduleWithUnavailability(this.events, value);
            this.clearFields(); //clear form fields
            this.appCalendar.updateFullCalendar(this.events);
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
        if(!this.validateFields())
        {
            return;
        }

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

        // Check for unavailability conflicts.
        var doesConflict = this.checkUnavailabilityConflict(unavailability);
        if(doesConflict)
        {
            return;
        }

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
}