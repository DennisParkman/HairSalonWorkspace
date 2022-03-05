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

  cancelAddAppointment()
  {
    this.addingAppointment = false;
    this.clearFields();
    this.dialog.closeAll();
  }

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

  addAppointment()
  {
    this.dateCreated = new Date();
    this.date = new Date(this.date);
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
    this.appointmentService.addAppointment(appointment).subscribe(value => 
    {
      //this.appointments.push(value);
      this.addingAppointment = false;
      let event : CalendarEvent = 
      {
        id: value.id, 
        start: this.date, 
        title: this.name + " - " + this.description
      };
      this.clearFields();
      console.log(event);
      this.appointments.push(value);
      this.appCalendar.updateCalendarEvent(event);
      this.dialog.closeAll();
    });
  }

  deleteAppointment(event: any)
  {
    
    //reload page
    this.appCalendar.deleteCalendarEvent(event)

    //find appointment based on calendar event
    let appIndexToDelete = this.appointments.findIndex(x => x.id === event.id);

    // find the Calendar event index
    //let calIndexToDelete = this.events.findIndex(x => x.id === event.id);

    //delete appointent from database
    this.appointmentService.deleteAppointment(this.appointments[appIndexToDelete])

    //remove appointment from appointment list
    this.appointments.splice(appIndexToDelete, 1);

    // remove calendar event from events list
    //this.events.splice(calIndexToDelete, 1);

  }

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

  updateAppointment()
  {
    //converte this.date to date object
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
    let event = 
    {
      id:this.id, 
      start: this.date, 
      title: this.name + " - " + this.description
    };
    //call service to update appointment in database
    this.appointmentService.updateAppointment(appointment);
    
    let appIndexToUpdate = this.appointments.findIndex(x => x.id === appointment.id);

    // find the Calendar event index
    //let calIndexToUpdate = this.events.findIndex(x => x.id === appointment.id);

    //remove appointment from appointment list
    this.appointments[appIndexToUpdate] = appointment;

    //this.events[calIndexToUpdate] = event;

    //clear fields and set booleans
    this.updatingAppointment = false;
    this.clearFields();
    
    this.appCalendar.updateCalendarEvent(event);
    this.dialog.closeAll();
  }

  cancelUpdateAppointment()
  {
    this.updatingAppointment = false;
    this.clearFields();
    this.dialog.closeAll();
  }

  setCreateAppointment()
  {
    this.addingAppointment = true;
    this.dialog.open(this.addDialog);
  }

}
