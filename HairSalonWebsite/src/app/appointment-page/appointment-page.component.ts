import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { CalendarEvent } from 'angular-calendar';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

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
  @ViewChild('addDialog', {static: true}) addDialog: TemplateRef<any>; //tag used for the add and update forms

  //appointment attributes for forms
  id: number;
  stylistid: number;
  name: string;
  email: string;
  phone: string;
  date: Date;
  dateCreated: Date;
  description: string;

  //booleans to display and hide forms on the appointments page
  loadingFinished: boolean = false; // boolean for displaying page
  appointmentLoading: boolean = true; // boolean to show appointments are being loaded from the backend
  addingAppointment: boolean = false;
  updatingAppointment: boolean = false;
  
  events: CalendarEvent[] = []; //array to populate all appointments on the calendar
  appointments: Appointment[]; //array of appointments serviced from the backend 

  constructor(private appointmentService: AppointmentService, private dialog: MatDialog, private toastr: ToastrService) { }

  /**
   * On loading page, all appointments on the database are loaded in and put into the event calendar array
   * and the appointments array
   */
  ngOnInit(): void 
  {
    //call service to load all appointments from the database
    this.appointmentService.getAppointment().subscribe(appointments => 
      {
        //load all appointmetns into the appointment array
        appointments.forEach(appointment => appointment.date = new Date(appointment.date));
        this.appointments = appointments; 

        //load appointment id, date, client name, and description for each appointment into the calendar array
        for(let appointment of this.appointments)
        {
          this.events.push(
            {
              id:appointment.id,
              start: new Date(appointment.date),
              title: appointment.name + " - " + appointment.description
            }
          );
          
        }
        
        // display the page and show that appointments are done loading
        this.loadingFinished = true; 
        this.appointmentLoading = false;
      }
    );
  }

  /**
   * Function to hide the the add appoinment field
   */
  cancelAddAppointment()
  {
    this.addingAppointment = false; //changes form boolean
    this.clearFields(); // clears all appointment fields
    this.dialog.closeAll(); //closes dialog boxes
  }

  /**
   * function to clear form fields
   */
  clearFields()
  {
    this.stylistid = 0;
    this.name = "";
    this.email = "";
    this.phone = "";
    this.date = new Date;
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
      dateCreated: this.dateCreated, 
      description: this.description
    };

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
    });
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

    //find appointment based on calendar event
    let appIndex = this.appointments.findIndex(x => x.id === event.id);
    let appointmentToUpdate: Appointment = this.appointments[appIndex]

    //set fields of current object form
    this.id = event.id;
    this.stylistid =  appointmentToUpdate.stylistID;
    this.name = appointmentToUpdate.name;
    this.email = appointmentToUpdate.email;
    this.phone = appointmentToUpdate.phone;
    this.date = appointmentToUpdate.date;
    this.dateCreated = appointmentToUpdate.dateCreated;
    this.description = appointmentToUpdate.description; 

    //show update form
    this.updatingAppointment = true;
    this.dialog.open(this.addDialog);
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
    let appointment = 
    {
      id: this.id, 
      stylistID: this.stylistid, 
      name: this.name, 
      email: this.email, 
      phone: this.phone, 
      date: this.date, 
      dateCreated: this.dateCreated, 
      description: this.description
    };

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
  setCreateAppointment()
  {
    this.addingAppointment = true;
    this.dialog.open(this.addDialog);
  }
  /**
   * Validate Fields before adding/updating an appointment
   */
  validateFields() : boolean
  {
    let valid = true;
    if(this.stylistid == null)
    {
      valid = false;
      this.toastr.error("Stylist Id is required");
    }
    else if(this.name == null)
    {
      valid = false;
      this.toastr.error("Name is required");
    }
    else if(this.email == null)
    {
      valid = false;
      this.toastr.error("Email is required");
    }
    else if(this.phone == null)
    {
      valid = false;
      this.toastr.error("Phone Number is required");
    }
    else if(this.date.getTime() < this.dateCreated.getTime())
    {
      valid = false;
      this.toastr.error("Date is invalid");
    }
    else if(this.date.getTime() < Date.now() - (24 * 60 * 60 * 1000))
    {
      valid = false;
      this.toastr.error("Date is invalid");
    }

    return valid;
  }

}
