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
import { StylisthoursService } from '../services/stylisthours-service/stylisthours.service';
import { StylistHours, WeekDay } from '../models/stylisthours.model';

@Component(
{
    selector: 'app-schedule-page',
    templateUrl: './schedule-page.component.html',
    styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit
{
    //Decorator to mark appCalendar as a ViewChild which allows for information to passed between components
    @ViewChild(EventCalendarComponent) appCalendar!: EventCalendarComponent
    @ViewChild('formDialog', {static: true}) formDialog: TemplateRef<any>; //tag used for the add and update forms

    stylistHours: StylistHours[][] = []; //list of unavailabilities
    appointments: Appointment[]; //list of appointments
    stylists: Stylist[]; //an array of stylists used to get id-name pairs from the stylists for the dropdown menu
    events: CalendarEvent[] = []; //array to populate all unavailabilities on the calendar
    fullStylistSchedule: CalendarEvent[][] = []; //2d array of of calendar events indexed at the stylist's id
    timePeriods: TimePeriod[]; //array of unavailabilities serviced from the backend

    //unavailability attributes for forms
    stylistid: number;

    sundayActive: boolean;
    sundayID: number | undefined;
    sundayStartTime: string | undefined;
    sundayEndTime: string | undefined;
    
    mondayActive: boolean;
    mondayID: number | undefined;
    mondayStartTime: string | undefined;
    mondayEndTime: string | undefined;
    
    tuesdayActive: boolean;
    tuesdayID: number | undefined;
    tuesdayStartTime: string | undefined;
    tuesdayEndTime: string | undefined;
    
    wednesdayActive: boolean;
    wednesdayID: number | undefined;
    wednesdayStartTime: string | undefined;
    wednesdayEndTime: string | undefined;
    
    thursdayActive: boolean;
    thursdayID: number | undefined;
    thursdayStartTime: string | undefined;
    thursdayEndTime: string | undefined;
    
    fridayActive: boolean;
    fridayID: number | undefined;
    fridayStartTime: string | undefined;
    fridayEndTime: string | undefined;
    
    saturdayActive: boolean;
    saturdayID: number | undefined;
    saturdayStartTime: string | undefined;
    saturdayEndTime: string | undefined;

    stylistSelected: string; //the stylist shown on the front end when changing schedule button

    //form control for dropdown
    stylistIDControl = new FormControl();
    //filter observable for dropdown
    filteredStylists: Observable<Stylist[]>;

    //booleans to display and hide forms on the unavailabilities page
    loadingFinished: boolean = false; // boolean for displaying page
    scheduleLoading: boolean = true; // boolean to show unavailabilities are being loaded from the backend
    
    editingSchedule: boolean = false;

    constructor(private stylistHoursService: StylisthoursService, 
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
          stylistHours: this.stylistHoursService.getStylistHours(), //call unavailabilities service to load all unavailabilities from the database
          appointments: this.appointmentService.getAppointment(), //call unavailabilities service to load all unavailabilities from the database
          stylists: this.stylistService.getStylists(), //call service to load all stylists from the database
          fullStylistSchedule: this.stylistScheduleService.getStylistSchedule(), //get full stylist work schedule
        }).subscribe(({stylistHours, stylists, appointments, fullStylistSchedule}) => 
        {
          //load all unavailabilities into the unavailabilities array
          for(let stylist of stylists)
          {
            if(stylist.id == null)
            {
              continue;
            }
            this.stylistHours[stylist.id] = [];
          }

          for(let stylistHour of stylistHours)
          {
            this.stylistHours[stylistHour.stylistID].push(stylistHour);
          }
  
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
          this.showWorkScheduleBy(stylists[0])
          
          //set up the dropdown filter
          this.filteredStylists = this.stylistIDControl.valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'string' ? value : value.name)),
            map(name => (name ? this.stylistDropdownFilter(name) : this.stylists.slice()))
          )
          
          // display the page and show that unavailabilities are done loading
          this.loadingFinished = true; 
          this.scheduleLoading = false;
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
     * Function to load stylists onto the calendar with their events being shown
     * @param stylist 
     */
    showWorkScheduleBy(stylist: Stylist)
    {
        this.events = []; //reset events

        //check if stylist id is null and return if true
        if(stylist.id == null)
        {
            return;
        }

        //load work schedule for stylist
        this.stylistid = stylist.id;
        for (let i: number = 0, index: number = stylist.id; i < this.fullStylistSchedule[index].length; i++) 
        {
            this.events.push(this.fullStylistSchedule[index][i]); 
        }
        
        //display stylist name on screen
        this.stylistSelected = stylist.name.split(" ")[0];
    }

    /* Functions surrounding form operations */

    /**
     * Checks the form fields to ensure that the times of the active days are in the form XX:XX, military time
     * @returns true if the fields are valid, or false if not
     */
    validateFields(hours: StylistHours) : boolean
    {
      console.log("oink");
      //is the startTime entered?
      if(hours.startTime == undefined)
      {
        this.toastr.error("Must enter a time for " + StylistHours.weekDayToString(hours.day));
        return false;
      }
      //is the time formatted properly
      else if(!hours.startTime.match(/^\d?\d:\d\d$/)) 
      {
        this.toastr.error("Time for " + StylistHours.weekDayToString(hours.day) + " is not in hh:mm format");
        return false;
      }
      //the time is formatted but is it in the range?
      
      let tokens = hours.startTime.split(":");
      let startHH = parseInt(tokens[0]);
      let startMM = parseInt(tokens[1]);
      if( startHH < 0 || startHH > 23 || startMM < 0 || startMM > 59)
      {
        this.toastr.error("Time for " + StylistHours.weekDayToString(hours.day) + " is not in 24-hr time");
        return false;
      }

      //is the time entered?
      if(hours.endTime == undefined)
      {
        this.toastr.error("Must enter a time for " + StylistHours.weekDayToString(hours.day));
        return false;
      }
      //is the time formatted properly
      else if(!hours.endTime.match(/^\d?\d:\d\d$/)) 
      {
        this.toastr.error("Time for " + StylistHours.weekDayToString(hours.day) + " is not in hh:mm format");
        return false;
      }
      //the time is formatted but is it in the range?
      
      tokens = hours.endTime.split(":");
      let endHH = parseInt(tokens[0]);
      let endMM = parseInt(tokens[1]);
      if( endHH < 0 || endHH > 23 || endMM < 0 || endMM > 59)
      {
        this.toastr.error("Time for " + StylistHours.weekDayToString(hours.day) + " is not in 24-hr time");
        return false;
      }
      

      console.log(endHH + ":" + endMM)
      console.log(startHH + ":" + startMM)

      //check that endtime > starttime
      if(endHH < startHH)
      {
        this.toastr.error("End time " + hours.endTime + " must be after " + hours.startTime + " for " + StylistHours.weekDayToString(hours.day))
        return false;
      }
      else if( endHH == startHH && endMM <= startMM )
      {
        this.toastr.error("AEnd time " + hours.endTime + " must be after " + hours.startTime + " for " + StylistHours.weekDayToString(hours.day))
        return false;
      }

      return true;
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
        //TODO Reset fields
     }

    /**
     * function to reset the dialog box
     */
     resetDialog() 
     {
        this.editingSchedule = false;
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
     * Function to show update unavailability form and set all form fields
     * @param event : object to be updated
     */
     setEditingSchedule()
     {
         this.resetDialog();
 
         let sunday;
         let monday;
         let tuesday;
         let wednesday;
         let thursday;
         let friday;
         let saturday;

         for(let stylistHour of this.stylistHours[this.stylistid])
         {
          if(stylistHour.day == WeekDay.Sunday)
          {
            sunday = stylistHour;
          } 
          else if(stylistHour.day == WeekDay.Monday)
          {
            monday = stylistHour;
          }
          else if(stylistHour.day == WeekDay.Tuesday)
          {
            tuesday = stylistHour;
          }
          else if(stylistHour.day == WeekDay.Wednesday)
          {
            wednesday = stylistHour;
          }
          else if(stylistHour.day == WeekDay.Thursday)
          {
            thursday = stylistHour;
          }
          else if(stylistHour.day == WeekDay.Friday)
          {
            friday = stylistHour;
          }
          else if(stylistHour.day == WeekDay.Saturday)
          {
            saturday = stylistHour;
          }
         }

         this.sundayActive = sunday != null;
         this.sundayID = sunday?.id;
         this.sundayStartTime = sunday?.startTime;
         this.sundayEndTime = sunday?.endTime;
        
         this.mondayActive = monday != null;
         this.mondayID = monday?.id;
         this.mondayStartTime = monday?.startTime;
         this.mondayEndTime = monday?.endTime;
        
         this.tuesdayActive = tuesday != null;
        this.tuesdayID = tuesday?.id;
        this.tuesdayStartTime = tuesday?.startTime;
        this.tuesdayEndTime = tuesday?.endTime;
        
        this.wednesdayActive = wednesday != null;
        this.wednesdayID = wednesday?.id;
        this.wednesdayStartTime = wednesday?.startTime;
        this.wednesdayEndTime = wednesday?.endTime;
        
        this.thursdayActive = thursday != null;
        this.thursdayID = thursday?.id;
        this.thursdayStartTime = thursday?.startTime;
        this.thursdayEndTime = thursday?.endTime;
        
        this.fridayActive = friday != null;
        this.fridayID = friday?.id;
        this.fridayStartTime = friday?.startTime;
        this.fridayEndTime = friday?.endTime;
        
        this.saturdayActive = saturday != null;
        this.saturdayID = saturday?.id;
        this.saturdayStartTime = saturday?.startTime;
        this.saturdayEndTime = saturday?.endTime;
 
         //show update form
         this.editingSchedule = true;
         this.dialog.open(this.formDialog);
     }

     submitEditSchedule() 
     {
      if(this.sundayActive && this.sundayID == null)
      {
        if(!this.sundayStartTime || !this.sundayEndTime)
        {
          this.toastr.error("Must enter a time for Sunday");
          return;
        }
        let day : StylistHours = {
          startTime: this.sundayStartTime,
          endTime: this.sundayEndTime,
          day: WeekDay.Sunday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.addStylistHours(day)
      }
      else if(this.sundayActive && this.sundayID)
      {
        if(!this.sundayStartTime || !this.sundayEndTime)
        {
          this.toastr.error("Must enter a time for Sunday");
          return;
        }
        let day : StylistHours = {
          id: this.sundayID,
          startTime: this.sundayStartTime,
          endTime: this.sundayEndTime,
          day: WeekDay.Sunday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.updateStylistHours(day)
      }
      else if(!this.sundayActive && this.sundayID)
      {
        if(!this.sundayStartTime || !this.sundayEndTime)
        {
          this.toastr.error("Must enter a time for Sunday");
          return;
        }
        let day : StylistHours = {
          id: this.sundayID,
          startTime: this.sundayStartTime,
          endTime: this.sundayEndTime,
          day: WeekDay.Sunday,
          stylistID: this.stylistid
        }
        
        this.deleteStylistHours(day)
      }

      if(this.mondayActive && this.mondayID == null)
      {
        if(!this.mondayEndTime || !this.mondayStartTime)
        {
          this.toastr.error("Must enter a time for Monday");
          return;
        }
        let day : StylistHours = {
          startTime: this.mondayStartTime,
          endTime: this.mondayEndTime,
          day: WeekDay.Monday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.addStylistHours(day)
      }
      else if(this.mondayActive && this.mondayID)
      {
        if(!this.mondayEndTime || !this.mondayStartTime)
        {
          this.toastr.error("Must enter a time for Monday");
          return;
        }
        let day : StylistHours = {
          id: this.mondayID,
          startTime: this.mondayStartTime,
          endTime: this.mondayEndTime,
          day: WeekDay.Monday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.updateStylistHours(day)
      }
      else if(!this.mondayActive && this.mondayID)
      {
        if(!this.mondayEndTime || !this.mondayStartTime)
        {
          this.toastr.error("Must enter a time for Monday");
          return;
        }
        let day : StylistHours = {
          id: this.mondayID,
          startTime: this.mondayStartTime,
          endTime: this.mondayEndTime,
          day: WeekDay.Monday,
          stylistID: this.stylistid
        }
        this.deleteStylistHours(day)
      }

      if(this.tuesdayActive && this.tuesdayID == null)
      {
        if(!this.tuesdayStartTime || !this.tuesdayEndTime)
        {
          this.toastr.error("Must enter a time for Tuesday");
          return;
        }
        let day : StylistHours = {
          startTime: this.tuesdayStartTime,
          endTime: this.tuesdayEndTime,
          day: WeekDay.Tuesday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.addStylistHours(day)
      }
      else if(this.tuesdayActive && this.tuesdayID)
      {
        if(!this.tuesdayStartTime || !this.tuesdayEndTime)
        {
          this.toastr.error("Must enter a time for Tuesday");
          return;
        }
        let day : StylistHours = {
          id: this.tuesdayID,
          startTime: this.tuesdayStartTime,
          endTime: this.tuesdayEndTime,
          day: WeekDay.Tuesday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.updateStylistHours(day)
      }
      else if(!this.tuesdayActive && this.tuesdayID)
      {
        if(!this.tuesdayStartTime || !this.tuesdayEndTime)
        {
          this.toastr.error("Must enter a time for Tuesday");
          return;
        }
        let day : StylistHours = {
          id: this.tuesdayID,
          startTime: this.tuesdayStartTime,
          endTime: this.tuesdayEndTime,
          day: WeekDay.Tuesday,
          stylistID: this.stylistid
        }
        this.deleteStylistHours(day)
      }

      if(this.wednesdayActive && this.wednesdayID == null)
      {
        if(!this.wednesdayStartTime || !this.wednesdayEndTime)
        {
          this.toastr.error("Must enter a time for Wednesday");
          return;
        }
        let day : StylistHours = {
          startTime: this.wednesdayStartTime,
          endTime: this.wednesdayEndTime,
          day: WeekDay.Wednesday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.addStylistHours(day)
      }
      else if(this.wednesdayActive && this.wednesdayID)
      {
        if(!this.wednesdayStartTime || !this.wednesdayEndTime)
        {
          this.toastr.error("Must enter a time for Wednesday");
          return;
        }
        let day : StylistHours = {
          id: this.wednesdayID,
          startTime: this.wednesdayStartTime,
          endTime: this.wednesdayEndTime,
          day: WeekDay.Wednesday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.updateStylistHours(day)
      }
      else if(!this.wednesdayActive && this.wednesdayID)
      {
        if(!this.wednesdayStartTime || !this.wednesdayEndTime)
        {
          this.toastr.error("Must enter a time for Wednesday");
          return;
        }
        let day : StylistHours = {
          id: this.wednesdayID,
          startTime: this.wednesdayStartTime,
          endTime: this.wednesdayEndTime,
          day: WeekDay.Wednesday,
          stylistID: this.stylistid
        }
        this.deleteStylistHours(day)
      }

      if(this.thursdayActive && this.thursdayID == null)
      {
        if(!this.thursdayStartTime || !this.thursdayEndTime)
        {
          this.toastr.error("Must enter a time for Thursday");
          return;
        }
        let day : StylistHours = {
          startTime: this.thursdayStartTime,
          endTime: this.thursdayEndTime,
          day: WeekDay.Thursday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.addStylistHours(day)
      }
      else if(this.thursdayActive && this.thursdayID)
      {
        if(!this.thursdayStartTime || !this.thursdayEndTime)
        {
          this.toastr.error("Must enter a time for Thursday");
          return;
        }
        let day : StylistHours = {
          id: this.thursdayID,
          startTime: this.thursdayStartTime,
          endTime: this.thursdayEndTime,
          day: WeekDay.Thursday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.updateStylistHours(day)
      }
      else if(!this.thursdayActive && this.thursdayID)
      {
        if(!this.thursdayStartTime || !this.thursdayEndTime)
        {
          this.toastr.error("Must enter a time for Thursday");
          return;
        }
        let day : StylistHours = {
          id: this.thursdayID,
          startTime: this.thursdayStartTime,
          endTime: this.thursdayEndTime,
          day: WeekDay.Thursday,
          stylistID: this.stylistid
        }
        this.deleteStylistHours(day)
      }

      if(this.fridayActive && this.fridayID == null)
      {
        if(!this.fridayStartTime || !this.fridayEndTime)
        {
          this.toastr.error("Must enter a time for Friday");
          return;
        }
        let day : StylistHours = {
          startTime: this.fridayStartTime,
          endTime: this.fridayEndTime,
          day: WeekDay.Friday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.addStylistHours(day)
      }
      else if(this.fridayActive && this.fridayID)
      {
        if(!this.fridayStartTime || !this.fridayEndTime)
        {
          this.toastr.error("Must enter a time for Friday");
          return;
        }
        let day : StylistHours = {
          id: this.fridayID,
          startTime: this.fridayStartTime,
          endTime: this.fridayEndTime,
          day: WeekDay.Friday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.updateStylistHours(day)
      }
      else if(!this.fridayActive && this.fridayID)
      {
        if(!this.fridayStartTime || !this.fridayEndTime)
        {
          this.toastr.error("Must enter a time for Friday");
          return;
        }
        let day : StylistHours = {
          id: this.fridayID,
          startTime: this.fridayStartTime,
          endTime: this.fridayEndTime,
          day: WeekDay.Friday,
          stylistID: this.stylistid
        }
        this.deleteStylistHours(day)
      }

      if(this.saturdayActive && this.saturdayID == null)
      {
        if(!this.saturdayStartTime || !this.saturdayEndTime)
        {
          this.toastr.error("Must enter a time for Saturday");
          return;
        }
        let day : StylistHours = {
          startTime: this.saturdayStartTime,
          endTime: this.saturdayEndTime,
          day: WeekDay.Saturday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.addStylistHours(day)
      }
      else if(this.saturdayActive && this.saturdayID)
      {
        if(!this.saturdayStartTime || !this.saturdayEndTime)
        {
          this.toastr.error("Must enter a time for Saturday");
          return;
        }
        let day : StylistHours = {
          id: this.saturdayID,
          startTime: this.saturdayStartTime,
          endTime: this.saturdayEndTime,
          day: WeekDay.Saturday,
          stylistID: this.stylistid
        }
        if(!this.validateFields(day))
        {
          return;
        }
        this.updateStylistHours(day)
      }
      else if(!this.saturdayActive && this.saturdayID)
      {
        if(!this.saturdayStartTime || !this.saturdayEndTime)
        {
          this.toastr.error("Must enter a time for Saturday");
          return;
        }
        let day : StylistHours = {
          id: this.saturdayID,
          startTime: this.saturdayStartTime,
          endTime: this.saturdayEndTime,
          day: WeekDay.Saturday,
          stylistID: this.stylistid
        }
        this.deleteStylistHours(day)
      }

      //if we get here all the fields are valid and the form should close
      this.editingSchedule = false;
      this.dialog.closeAll(); //close dialog box
      this.clearFields(); //clear form fields
     }

    /**
     * function to add a new unavailability to the database and front end lists
     */
    addStylistHours(hours: StylistHours)
    {
      /*  removed because the form would still submit if one field was valid
          validate now called in submitEditSchedule
      if(!this.validateFields(hours))
        {
            return;
        }
      */
        // TODO Check for conflicts
        // var doesConflict = this.checkUnavailabilityConflict(unavailability);
        // if(doesConflict)
        // {
        //     return;
        // }

        

        //call unavailability service to add unavailability to database
        this.stylistHoursService.addStylistHours(hours).subscribe(value => 
        {
            // this.editingSchedule = false; //hide add unavailability form

            this.stylistHours[this.stylistid].push(value); //push unavailability to unavailability list

            //these should go in the end of submitEditSchedule
            //this.dialog.closeAll(); //close dialog box
            //this.clearFields(); //clear form fields

            // Update with service and Update calendar
            this.stylistScheduleService.getStylistSchedule().subscribe(value =>
              {
                  this.fullStylistSchedule = value;
                  console.log(this.stylistid)
                  this.events = value[this.stylistid]
              });
        });
        
    }

    /**
     * Function to delete an unavailability from the database and from the front end lists
     * @param event : event to be deleted
     */
    deleteStylistHours(hours: StylistHours)
    {

        //find unavailability based on calendar event
        let appIndexToDelete = this.stylistHours[this.stylistid].findIndex(x => x.id === hours.id);

        //delete appointent from database
        this.stylistHoursService.deleteStylistHours(hours).subscribe(() => {
            
            //remove unavailability from unavailability list
            this.stylistHours[this.stylistid].splice(appIndexToDelete, 1);

            // this.dialog.closeAll();

            //load full work schedule by same stylist
            this.stylistScheduleService.getStylistSchedule().subscribe(value =>
            {
                this.fullStylistSchedule = value;
                console.log(this.stylistid)
                this.events = value[this.stylistid]
            });
            // this.clearFields(); //clear form fields
        })

    }

    /**
     * Function to update database with changed appointment information and update front end list 
     * with new information
     */
    updateStylistHours(hours: StylistHours)
    {
      /*  removed because the form would still submit if one field was valid
          validate now called in submitEditSchedule
        if(!this.validateFields(hours))
        {
            return;
        }
*/
        // Check for unavailability conflicts.
        //var doesConflict = this.checkUnavailabilityConflict(hours);
        //if(doesConflict)
        //{
        //    return;
        //}

        //call service to update unavailability in database
        this.stylistHoursService.updateStylistHours(hours).subscribe(() => {

            //find index of unavailability to change and replace existing information in unavailability list
            let appIndexToUpdate = this.stylistHours[this.stylistid].findIndex(x => x.id === hours.id);
            this.stylistHours[this.stylistid][appIndexToUpdate] = hours;

            //clear fields and set booleans
            // this.editingSchedule = false;

            // this.dialog.closeAll();

            //load full work schedule by same stylist
            this.stylistScheduleService.getStylistSchedule().subscribe(value =>
            {
                this.fullStylistSchedule = value;
                console.log(this.stylistid)
                this.events = value[this.stylistid]
            });
            // this.clearFields(); //clear form fields
        });
        
        
    }
}