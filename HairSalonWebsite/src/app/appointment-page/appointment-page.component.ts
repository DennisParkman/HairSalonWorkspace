import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { CalendarEvent } from 'angular-calendar';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Stylist } from '../models/stylist.model';
import { FormControl } from '@angular/forms';
import { forkJoin, Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { StylistService } from '../services/stylist-service/stylist.service';
import { StylistScheduleService } from '../services/stylist-schedule-service/stylist-schedule.service';
import  {EventColor} from '../../../node_modules/calendar-utils/calendar-utils.d';



@Component(
{
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.scss']
})
export class AppointmentPageComponent implements OnInit
{
  //Decorator to mark appCalendar as a ViewChild which allows for information to passed between components
  @ViewChild(EventCalendarComponent) appCalendar!: EventCalendarComponent
  @ViewChild('formDialog', {static: true}) formDialog: TemplateRef<any>; //tag used for the add and update forms

  //appointment attributes for forms
  id: number;
  stylistid: number;
  name: string;
  email: string;
  phone: string;
  date: Date;
  length: number;
  dateCreated: Date;
  description: string;

  //form control for dropdown
  stylistIDControl = new FormControl();
  //filter observable for dropdown
  filteredStylists: Observable<Stylist[]>;

  //booleans to display and hide forms on the appointments page
  loadingFinished: boolean = false; // boolean for displaying page
  appointmentLoading: boolean = true; // boolean to show appointments are being loaded from the backend
  addingAppointment: boolean = false;
  updatingAppointment: boolean = false;

  //lists
  events: CalendarEvent[] = []; //array to populate all appointments on the calendar
  eventsToShow: CalendarEvent[] = []; //array to populate all appointments on the calendar
  appointments: Appointment[]; //array of appointments serviced from the backend 
  stylists: Stylist[]; //an array of stylists used to get id-name pairs from the stylists for the dropdown menu
  selectedStylistList: Stylist[] = []; //list of all stylist selected by user
  fullStylistSchedule: CalendarEvent[][] = []; //2d array of of calendar events indexed at the stylist's id

  constructor(private appointmentService: AppointmentService, 
    private stylistService: StylistService,
    private stylistScheduleService:  StylistScheduleService,
    private dialog: MatDialog, 
    private toastr: ToastrService,
    ) 
  { }

  /**
   * On loading page, all appointments on the database are loaded in and put into the event calendar array
   * and the appointments array
   */
  ngOnInit(): void 
  {
    //forkjoin call to stylists and appointments database tables so they happen correctly
    forkJoin(
      {
        appointments: this.appointmentService.getAppointment(), //call unavailabilities service to load all unavailabilities from the database
          stylists: this.stylistService.getStylists(), //call service to load all stylists from the database
          fullStylistSchedule: this.stylistScheduleService.getStylistSchedule(), //get full stylist work schedule
      }).subscribe(({appointments, stylists, fullStylistSchedule}) => 
      {
        //load all appointments into the appointments array
        appointments.forEach(appointments => 
          {
            appointments.date = new Date(appointments.date);
            appointments.dateCreated = new Date(appointments.dateCreated);
          });
        this.appointments = appointments; //save the list of appointments

        this.stylists = stylists; //save the stylist list
        console.log(this.stylists);

        this.fullStylistSchedule = fullStylistSchedule; //load full work schedule
        console.log(this.fullStylistSchedule);
        
        //add work schedule to events list to be shown
        this.showWorkScheduleBy(this.stylists[0])

        //set up the dropdown filter
        this.filteredStylists = this.stylistIDControl.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.name)), //but it also worked with stylistName???
          map(name => (name ? this.stylistDropdownFilter(name) : this.stylists.slice()))
        )
        
        this.eventsToShow = this.events; //load events to show on calendar
        // display the page and show that appointments are done loading
        this.loadingFinished = true; 
        this.appointmentLoading = false;
      }
    );
  }

/**
 * Function to load stylists onto the calendar with their events being shown
 * @param stylist 
 */
  showWorkScheduleBy(stylist: Stylist)
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
      for (let appointment of this.appointments)
      {
        if(appointment.stylistID == stylist.id)
        this.events.push(
          {
            
            id:appointment.id,
            start: new Date(appointment.date),
            title: appointment.name + " - " + appointment.description, //appointment.name is the client
            color: {primary: '#228B22', secondary: '#ffffff'}
          }
        )
      }

      console.log(this.events);

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
    this.stylistid = 0;
    this.stylistIDControl.reset(); //clear the dropdown value
    this.name = "";
    this.email = "";
    this.phone = "";
    this.date = new Date;
    this.length = 0;
    this.dateCreated = new Date;
    this.description = "";
  }

  /**
   * function to add a new appointment to the database and front end lists
   */
  addAppointment()
  {
    //convert form dates to date objects
    this.dateCreated = new Date();
    this.date = new Date(this.date);
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
              title: this.name + " - " + this.description,
              color: {primary: '#228B22', secondary: '#ffffff'}
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
   * Function to delete an appointment from the database and from the front end lists
   * @param event : event to be deleted
   */
  deleteAppointment(event: any)
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
   * Function to show update appoinment form and set all form fields
   * @param event : object to be updated
   */
  startUpdateAppointment(event: any)
  {
    this.resetDialog();

    //find appointment based on calendar event
    let appIndex = this.appointments.findIndex(x => x.id === event.id);
    let appointmentToUpdate: Appointment = this.appointments[appIndex]

    //set fields of current object form
    this.id = event.id;
    this.stylistid =  appointmentToUpdate.stylistID;
    this.stylistIDControl.setValue(this.stylists.find(stylist => stylist.id == this.stylistid)); //autopopulate the dropdown with the stylist
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
   * Function to update database with changed appointment information and update front end list 
   * with new information
   */
  updateAppointment()
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
      title: this.name + " - " + this.description,
      color: {primary: '#228B22', secondary: '#ffffff'}
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
   * Method to check appointment conflicts from a given appointments. Returns true or false
   * if the appointment does or does not conflict.
   */
  checkAppointmentConflict(newAppointment: Appointment)
  {
    let newAppStarttime = new Date(newAppointment.date).valueOf();
    let newAppEndtime = new Date(newAppointment.date).valueOf() + (newAppointment.length * 60 * 1000);
    //loop through all the appointments
    for(let app of this.appointments)
    {	
      console.log("Heeeee")
      //if appointment is the same as one being updated, then skip it
      if(app.id == newAppointment.id)
      {
        continue;
      }
      
      //if stylist matches
      if(app.stylistID == newAppointment.stylistID)
      {
        let oldAppStarttime = new Date(app.date).valueOf();
        let oldAppEndtime =new Date(app.date).valueOf() + (app.length * 60 * 1000);
        // Check for any overlap between the time period of a current appointment by assessing 
        // whether the new appointment start time or new appointment end time falls between the range of the next time being evaluated.
         
        if((newAppStarttime >= oldAppStarttime && newAppStarttime <= oldAppEndtime) || 
          (newAppEndtime >= oldAppStarttime && newAppEndtime <= oldAppEndtime) || 
          (newAppStarttime < oldAppStarttime && newAppEndtime > oldAppEndtime))
        {
          //Add toast message
          this.toastr.error("Appointment " + newAppointment.date + " with length of time " + newAppointment.length + " has conflicts with\n"
          + " appointment " + app.date + " with length " + app.length, " Appointment Conflict Detection");
            
          console.log("Appointment " + newAppointment.date + " with length of time " + newAppointment.length + " has conflicts with\n"
          + " appointment " + app.date + " with length " + app.length, " Appointment Conflict Detection");
          return true
        }
        
      }

    }

    for(let ws of this.fullStylistSchedule[newAppointment.stylistID])
      {
        console.log("oniks")
        let hoursStartTime = new Date(ws.start).valueOf();
        if(ws.end == undefined)
        {
          continue
        }
        let hoursEndTime =new Date(ws.end).valueOf();
        // Check for any overlap between the time period of a current appointment by assessing 
        // whether the new appointment start time or new appointment end time falls between the range of the next time being evaluated.
         
        if(!((newAppStarttime >= hoursStartTime && newAppStarttime <= hoursEndTime) || 
          (newAppEndtime >= hoursStartTime && newAppEndtime <= hoursEndTime) || 
          (newAppStarttime < hoursStartTime && newAppEndtime > hoursEndTime)))
        {
          //Add toast message
          this.toastr.error("Appointment " + newAppointment.date + " with length of time " + newAppointment.length + " is outside of stylist working hours\n"
          + "Hours start at " + ws.start + " and end at" + ws.end);
            
          console.log("Appointment " + newAppointment.date + " with length of time " + newAppointment.length + " is outside of stylist working hours\n"
          + "Hours start at " + ws.start + " and end at" + ws.end);
          return true
        }
      }
    //No conflicts 
    return false;
  }
  /**
   * function to close update form and clear all form fields
   */
  cancelUpdateAppointment()
  {
    this.updatingAppointment = false;
    this.clearFields();
    this.dialog.closeAll();
  }

  /**
   * function to show create form from dialog box of events
   */
  setCreateAppointment(date: Date = new Date())
  {
    this.resetDialog();
    this.date = date;
    this.addingAppointment = true;
    this.dialog.open(this.formDialog);
  }

  /**
   * function to reset the dialog box
   */
  resetDialog() 
  {
    this.updatingAppointment = false;
    this.addingAppointment = false;
    this.clearFields();
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
