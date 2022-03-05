import { Component, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
@Component(
{
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.scss']
})
export class AppointmentPageComponent implements OnInit
{
  @ViewChild(EventCalendarComponent) appCalendar!: EventCalendarComponent
  @ViewChild('addDialog', {static: true}) addDialog: TemplateRef<any>;

  appointments: Appointment[];
  id: number;
  stylistid: number;
  name: string;
  email: string;
  phone: string;
  date: Date;
  dateCreated: Date;
  description: string;

  addingAppointment: boolean = false;
  loadingFinished: boolean = false;
  updatingAppointment: boolean = false;
  appointmentLoading: boolean = true;

  events: CalendarEvent[] = [];

  constructor(private appointmentService: AppointmentService, private dialog: MatDialog) { }

  ngOnInit(): void 
  {
    this.appointmentService.getAppointment().subscribe(appointments => 
      {
        appointments.forEach(appointment => appointment.date = new Date(appointment.date));
        this.appointments = appointments; 

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
        
        this.loadingFinished = true; 
        this.appointmentLoading = false;
      }
    );
  }

  /**
   * function to hide adding appointment form
   */
  cancelAddAppointment()
  {
    this.addingAppointment = false; //changes form boolean
    this.clearFields(); // clears all appointment fields
    this.dialog.closeAll(); //closes dialog boxes
  }

  /**
   * function to clear all appoinment attributes 
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
   * function to add a new appointment to the database when the 
   * add form is submitted
   */
  addAppointment()
  {
    //reformat data objects to send through the service call
    this.dateCreated = new Date();
    this.date = new Date(this.date);

    //create appointment object with form values
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

    //call service to add appointment to the database
    this.appointmentService.addAppointment(appointment).subscribe(value => 
    {
      this.addingAppointment = false; //hide add appointment form

      //create calendar event to populate the front end
      let event : CalendarEvent = 
      {
        id: value.id, 
        start: this.date, 
        title: this.name + " - " + this.description
      };

      this.clearFields(); //clear all form fields
      this.appointments.push(value); //add appointments to appointment list
      this.appCalendar.updateCalendarEvent(event); //add event to event calendar
      this.dialog.closeAll(); //close all dialog boxes
    });
  }

  /**
   * function to delete an appointment from the appointments list, calendar events list, and database table
   * @param event is an object of type any that contains a calendar event to delete
   */
  deleteAppointment(event: any)
  {
    //delete the calendar event selected
    this.appCalendar.deleteCalendarEvent(event)

    //find appointment based on calendar event
    let appIndexToDelete = this.appointments.findIndex(x => x.id === event.id);

    //delete appointent from database
    this.appointmentService.deleteAppointment(this.appointments[appIndexToDelete])

    //remove appointment from appointment list
    this.appointments.splice(appIndexToDelete, 1);
  }

  /**
   * fucntion to show update form and populate form fields
   * @param event is an object of type any that contains a calendar event to update
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
   * function to update an appointment from the appointments list, the calendar events list, and database table 
   */
  updateAppointment()
  {
    //convert this.date to date object
    this.date = new Date(this.date);

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

    //create the calendar event to update the calendar list
    let event = 
    {
      id:this.id, 
      start: this.date, 
      title: this.name + " - " + this.description
    };

    //call service to update appointment in database
    this.appointmentService.updateAppointment(appointment);
    
    //find the appointment index to update
    let appIndexToUpdate = this.appointments.findIndex(x => x.id === appointment.id);

    //remove appointment from appointment list
    this.appointments[appIndexToUpdate] = appointment;

    //clear fields and set booleans
    this.updatingAppointment = false;
    this.clearFields();
    
    //update calendar list and close dialog box
    this.appCalendar.updateCalendarEvent(event);
    this.dialog.closeAll();
  }

  /**
   * function to hide the update form, clear input fields, and close dialog boxes
   */
  cancelUpdateAppointment()
  {
    this.updatingAppointment = false;
    this.clearFields();
    this.dialog.closeAll();
  }

  /**
   * function to show add appointment form through dialog box
   */
  setCreateAppointment()
  {
    this.addingAppointment = true;
    this.dialog.open(this.addDialog);
  }

}
