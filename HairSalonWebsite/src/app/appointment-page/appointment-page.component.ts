import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { CalendarEvent } from 'angular-calendar';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
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

        //create appointment variable to store form fields
        let appointment : Appointment= 
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
   * Method to check appointment conflicts from a given appointments. Returns true or false
   * if the appointment does or does not conflict.
   */
  checkAppointmentConflict(newAppoinment: Appointment)
  {
    //loop through all the appointments
    for(let app of this.appointments)
    {	
      //if stylist matches
      if(app.stylistID == newAppoinment.stylistID)
      {
        //if date matches
        if(app.date.getDate() == newAppoinment.date.getDate())
        {	
          let newAppStarttime = newAppoinment.date.getTime();
          let newAppEndtime = newAppoinment.date.getTime() + newAppoinment.length;
          let oldAppStarttime = app.date.getTime();
          let oldAppEndtime =app.date.getTime() + app.length;
          // Check for any overlap between the time period of a current appointment by assessing 
          // whether the new appointment start time or new appointment end time falls between the range of the next time being evaluated. 
          if((newAppStarttime >= oldAppStarttime && newAppStarttime <= oldAppEndtime) || 
            (newAppEndtime >= oldAppStarttime && newAppEndtime <= oldAppEndtime) || 
            (newAppStarttime < oldAppStarttime && newAppEndtime > oldAppEndtime))
          {
            //Add toast message
            this.toastr.error("Appointment" + newAppoinment.date + "with length of time" + newAppoinment.length + "has conflicts with\n"
            + "appointment" + app.date + "with length" + app.length, "Appointment Conflict Detection");
            
            console.log("Appointment" + newAppoinment.date + "with length of time" + newAppoinment.length + "has conflicts with\n"
                        + "appointment" + app.date + "with length" + app.length);
            return true;
          }
        }
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
  setCreateAppointment()
  {
    this.resetDialog();
    this.addingAppointment = true;
    this.dialog.open(this.formDialog);
  }

  resetDialog() {
    this.updatingAppointment = false;
    this.addingAppointment = false;
    this.clearFields();
  }

}
