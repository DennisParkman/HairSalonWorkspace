import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent} from 'angular-calendar';
import { Unavailability } from '../models/unavailability.model';
import { Appointment } from '../models/appointment.model';
import { Stylist } from '../models/stylist.model';
import { UnavailabilityService } from '../services/unavailability-service/unavailability.service';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { StylistService } from '../services/stylist-service/stylist.service';
import { forkJoin } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DayDialogBoxComponent } from '../day-dialog-box/day-dialog-box.component';
import { StylistHours } from '../models/stylisthours.model';
import { StylistScheduleService } from '../services/stylist-schedule-service/stylist-schedule.service';


@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit 
{
  //attributes to change and update calendar view
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  startOfDay: CalendarEvent;

  //lists that will be used to populate the event calendar list
  appointmentList: Appointment[];
  stylistHours: StylistHours[];
  stylistList: Stylist[];
  selectedSylistList: Stylist[] = []; //list of all stylist selected by user
  
  eventsToShow: CalendarEvent[] = []; //calendar events list of unavailabilities and appointments
  allEvents: CalendarEvent[]= []; //all calendar events for the schedule page

  scheduleLoading: boolean = true; //boolean to load page

  //form fields
  stylistid: number; //the id of the stylist the hours are for

  constructor(private stylistService: StylistService, 
    private stylistScheduleService: StylistScheduleService, 
    private appointmentService: AppointmentService,
    public dialog: MatDialog ) { }

  /**
   * On loading page, all unavailabilities and appointments on the database are loaded in and put into the event calendar array
   * and their corresponding object arrays.
   */
  ngOnInit(): void 
  {

    forkJoin(
      {
        //call service methods to fetch all unavaiblites, appointments, and stylists
        appointments: this.appointmentService.getAppointment(), 
        stylistHours: this.stylistScheduleService.getStylistSchedule(),
        stylists: this.stylistService.getStylists()
      }).subscribe(({appointments, stylistHours, stylists}) => {
        this.appointmentList = appointments; //set appointments to appointment list
        console.log(this.appointmentList);

        //TO-DO: cycle through the hours and put them into the calendar
        //this.stylistHours = stylistHours; //set unavailabilities to unavailabilities list
        //console.log(this.stylistHours);

        this.stylistList = stylists; //set unavailabilities to unavailabilities list
        console.log(this.stylistList);
        
        //add appointments to calendar event list
        for(let appointment of this.appointmentList)
        {
          this.allEvents.push(
            {
              start: new Date(appointment.date),
              title: appointment.name + " - " + appointment.description
            }
          );
        }
        this.eventsToShow = this.allEvents; //load events to show on calendar
        console.log(this.eventsToShow);
        this.scheduleLoading = false; //show calendar
      }
    );
  }

  /**
   * Function to maintain all stylists selected on the front end drop down menu and call the showScheduleBy
   * function to update the calendar. The function checks to see if the stylist passed as a parameter is currently
   * on the list. If they are not on the list, this indicates that the user selected them for viewing and they are
   * appended to the list. If they are currently on the list, then that idicates that the user deselected them, and 
   * they are removed from the list.
   * @param stylist : stylist to be added or subtracted from the list of stylist selected
   */
  changeStylistSelected(stylist: Stylist)
  {
    let index = this.selectedSylistList.indexOf(stylist); //get index of stylist on selected list of stylists
    if(index != -1) //if they are already on list, remove
    {
      this.selectedSylistList.splice(index,1);
    }
    else //else, add the stylist to the list
    {
      this.selectedSylistList.push(stylist);
    }
    console.log(this.selectedSylistList);
    this.showScheduleBy(); //update the events being shown on the calendar
  }

  /**
   * Function to show only calendar events of stylists selected by the user. Defaults to 
   * showing all stylists if no stylists are selected
   * @param stylist : the stylist to update the calendar events list by
   */
  showScheduleBy()
  {
    //check stylist selected to see if it is empty or not
    if(this.selectedSylistList.length == 0) //if list is empty, show all events
    {
      this.eventsToShow = this.allEvents;
    }
    else //show all events of selected stylists
    {
      this.eventsToShow = []; //create local list of events for one stylist

      //iterate through selectedStylistsList to display all events associated with them
      for(let stylist of this.selectedSylistList)
      {
        //get unavaiblites and appointments for the requested stylist
        for(let appointment of this.appointmentList) //check for appointments
        {
          if(appointment.stylistID == stylist.id) //load appoinment if stylistID is equal to requested stylist
          {
            //create appointment and push it onto the event list
            this.eventsToShow.push(
              {
                start: new Date(appointment.date),
                title: appointment.name + " - " + appointment.description
              }
            );
          }  
        }

        //TO-DO: do the same stuff as in ngOnInit
        /*
        for(let unavailability of this.unavailabilitiesList) //check for unavailabilities
        {
          if(unavailability.stylistID == stylist.id) //load unavailability if stylistID is equal to requested stylist
          {
            //create unavailability and push it onto the event list
            this.eventsToShow.push(
              {
                start: new Date(unavailability.startDate),
                end: new Date(unavailability.endDate),
                title: unavailability.stylistName + " time off"
              }
            );
          }
        }
        */
      }
      console.log(this.eventsToShow);
    }
  }

  /**
   * helper function for ngOnInit to filter the stylist list by an entered stylist name
   */
   private stylistDropdownFilter(name: string): Stylist[]
   {
     const filterValue = name.toLowerCase();
 
     return this.stylistList.filter(stylist => stylist.name.toLowerCase().includes(filterValue));
   }
 
   /**
    * event method that sets the form stylistid field
    * @param stylist the stylist that was selected; it is type any because this.stylistid is not nullable, but stylist.id is
    */
   setStylistIdFromDropdown(stylist: any)
   {
     console.log(stylist);
     this.stylistid = stylist.id;
   }
 
   /** 
    * @param stylist the stylist whose name should be displayed
    * @returns the name of the stylist
    */
   stylistDropdownDisplay(stylist: Stylist): string
   {
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
   * Function to close and reset dialog box
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
    //TO-DO: use the right fields
    /*
    this.stylistid = 0;
    this.stylistIDControl.reset(); //clear the dropdown value
    this.name = "";
    this.email = "";
    this.phone = "";
    this.date = new Date;
    this.length = 0;
    this.dateCreated = new Date;
    this.description = "";
    */
  }

  /**
   * function to reset the dialog box
   */
   resetDialog() 
   {
     //TO-DO: use the right fields
    /*
     this.updatingAppointment = false;
     this.addingAppointment = false;
     this.clearFields();
     */
   }

   /**
   * function to add a new appointment to the database and front end lists
   */
  addSchedule()
  {
    //convert form dates to date objects
    // this.dateCreated = new Date();
    // this.date = new Date(this.date);
    if(!this.validateFields())
    {
      return;
    }
    //create appointment variable to store form fields
    let appointment = 
    {
      stylistID: this.stylistid, 
      name: this.name, 
      email: this.email, 
      phone: this.phone, 
      date: this.date, 
          length: this.length,
      dateCreated: this.dateCreated, 
      description: this.description
    };

        
        //To check if there is conflict with other appointments for same stylist 
        var doesConflict = this.checkAppointmentConflict(appointment);
        if(doesConflict)
        {
          return;
        }
        //call appointment service to add appointment to database
        this.appointmentService.addAppointment(appointment).subscribe(value => 
          {
            this.addingAppointment = false; //hide add appointment form

            //create calendar event to add to event list
            let event : CalendarEvent = 
            {
              id: value.id, 
              start: this.date, 
              title: this.name + " - " + this.description
            };
            this.clearFields(); //clear form fields
            this.appointments.push(value); //push appointment to appointment list

            //call calendar event component function to reload event list with new item
            this.appCalendar.updateCalendarEvent(event);
            this.dialog.closeAll(); //close dialog box
          }
        );
    
  }

  /**
   * function to show create form from dialog box of events
   */
  setCreateSchedule(date: Date = new Date())
  {
    this.resetDialog();
    this.date = date;
    this.addingAppointment = true;
    this.dialog.open(this.formDialog);
  }
  
  /**
   * Function to delete an schedule from the database and from the front end lists
   * @param event : event to be deleted
   */
   deleteSchedule(event: any)
   {
     //reload page
     this.appCalendar.deleteCalendarEvent(event)
 
     //find appointment based on calendar event
     let appIndexToDelete = this.appointments.findIndex(x => x.id === event.id);
 
     //delete appointent from database
     this.appointmentService.deleteAppointment(this.appointments[appIndexToDelete])
 
     //remove appointment from appointment list
     this.appointments.splice(appIndexToDelete, 1);
   }

  /**
   * Function to show update stylist hours form and set all form fields
   * @param event : object to be updated
   */
   startUpdateSchedule(event: any)
   {
     this.resetDialog();
 
     //find appointment based on calendar event
     let appIndex = this.stylistHours.findIndex(x => x.id === event.id);
     let appointmentToUpdate: Appointment = this.appointments[appIndex]
 
     //set fields of current object form
     this.id = event.id;
     this.stylistid =  appointmentToUpdate.stylistID;
     this.stylistIDControl.setValue(this.stylistList.find(stylist => stylist.id == this.stylistid)); //autopopulate the dropdown with the stylist
     this.name = appointmentToUpdate.name;
     this.email = appointmentToUpdate.email;
     this.phone = appointmentToUpdate.phone;
     this.date = appointmentToUpdate.date;
     this.length = appointmentToUpdate.length;
     this.dateCreated = appointmentToUpdate.dateCreated;
     this.description = appointmentToUpdate.description; 
 
     //show update form
     this.updatingAppointment = true;
     this.dialog.open(this.formDialog);
   }

  /**
   * Function to update database with changed stylist hours information and update front end list 
   * with new information
   */
   updateSchedule()
   {
     //convert this.date to date object
     this.date = new Date(this.date);
     if(!this.validateFields())
     {
       return;
     }
     //package fields into an appointment object
     let appointment : Appointment= 
     {
       id: this.id, 
       stylistID: this.stylistid, 
       name: this.name, 
       email: this.email, 
       phone: this.phone, 
       date: this.date, 
       length: this.length,
       dateCreated: this.dateCreated, 
       description: this.description
     };
 
     //To check if there is conflict with other appointments for same stylist 
     var doesConflict = this.checkAppointmentConflict(appointment);
     if(doesConflict)
     {
       return;
     }
     //create a calendar event from appointment object
     let event = 
     {
       id:this.id, 
       start: this.date, 
       title: this.name + " - " + this.description
     };
 
     //call service to update appointment in database
     this.appointmentService.updateAppointment(appointment);
     
     //find index of appoinment to change and replace existing information in appoinment list
     let appIndexToUpdate = this.appointments.findIndex(x => x.id === appointment.id);
     this.appointments[appIndexToUpdate] = appointment;
 
     //clear fields and set booleans
     this.updatingAppointment = false;
     this.clearFields();
     
     //reload calendar view and close dialog box
     this.appCalendar.updateCalendarEvent(event);
     this.dialog.closeAll();
   }

  /**
   * 
   */
   checkScheduleConflict(newHours: StylistHours)
   {
     //loop through all the appointments
     for(let app of this.appointments)
     {	
       //if appointment is the same as one being updated, then skip it
       if(app.id == newAppointment.id)
       {
         continue;
       }
       
       //if stylist matches
       if(app.stylistID == newAppointment.stylistID)
       {
         let newAppStarttime = new Date(newAppointment.date).valueOf();
         let newAppEndtime = new Date(newAppointment.date).valueOf() + (newAppointment.length * 60 * 1000);
         let oldAppStarttime = new Date(app.date).valueOf();
         let oldAppEndtime =new Date(app.date).valueOf() + (app.length * 60 * 1000);
         // Check for any overlap between the time period of a current appointment by assessing 
         // whether the new appointment start time or new appointment end time falls between the range of the next time being evaluated.
          
         if((newAppStarttime >= oldAppStarttime && newAppStarttime <= oldAppEndtime) || 
           (newAppEndtime >= oldAppStarttime && newAppEndtime <= oldAppEndtime) || 
           (newAppStarttime < oldAppStarttime && newAppEndtime > oldAppEndtime))
         {
           //Add toast message
           this.toastr.error("Appointment" + newAppointment.date + "with length of time" + newAppointment.length + "has conflicts with\n"
           + "appointment" + app.date + "with length" + app.length, "Appointment Conflict Detection");
             
           console.log("Appointment" + newAppointment.date + "with length of time" + newAppointment.length + "has conflicts with\n"
                         + "appointment" + app.date + "with length" + app.length);
           return true;
         }
         
       }
     }
     //No conflicts 
     return false;
   }
   
   /**
    * Validate Fields before adding/updating an appointment
    */
   validateFields() : boolean
   {
     //regular expression used to validate email
     const regularExpression = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
     let validEmail = regularExpression.test(String(this.email).toLowerCase());
     let valid = true;
     if(this.stylistid == null || this.stylistid == 0)
     {
       valid = false;
       this.toastr.error("Stylist ID is required");
     }
     else if(this.name == null || this.name == "")
     {
       valid = false;
       this.toastr.error("Name is required");
     }
     else if(this.email == null || (!validEmail))
     {
       valid = false;
       this.toastr.error("Email is invalid");
     }
     //to check if the phone number is a 10 digit number
     else if((this.phone == "") || (!this.phone.match(/^\d{10}$/)))
     {
       valid = false;
       this.toastr.error("Phone Number is invalid");
     }
 
     else if(this.date.getTime() < Date.now() - (24 * 60 * 60 * 1000))
     {
       valid = false;
       this.toastr.error("Date is invalid");
     }
 
     return valid;
   }
}
