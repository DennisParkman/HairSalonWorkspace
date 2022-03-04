import { Component, OnInit } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { AppointmentService } from '../services/appointment-service/appointment.service';
@Component({

  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.scss']
})
export class AppointmentPageComponent implements OnInit
{
  appointments: Appointment[];
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

  events: CalendarEvent[] = [];

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void 
  {
    this.appointmentService.getAppointment().subscribe(s => 
      {
        this.appointments = s; 
        console.log(this.appointments);

        for(let appointment of this.appointments)
        {
          this.events.push(
            {
              id:appointment.iD,
              start: new Date(appointment.date),
              title: appointment.name + " - " + appointment.description
            }
          );
          
        }

        
        this.loadingFinished = true; 
      }
    );
  }

  showAddAppointment()
  {
    this.addingAppointment = true;
  }

  cancelAddAppointment()
  {
    this.addingAppointment = false;
    this.clearFields();
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
    let appointment = {stylistID: this.stylistid, name: this.name, email: this.email, phone: this.phone, date: this.date, dateCreated: this.dateCreated, description: this.description};
    this.appointmentService.addAppointment(appointment).subscribe(value => 
    {
      this.appointments.push(value);
      this.addingAppointment = false;
      this.clearFields();
    });
  }

  deleteAppointment(event: any)
  {
    //extract calendar event from emmitted event
    let eValue = event.value;

    //find appointment based on calendar event
    let appIndexToDelete = this.appointments.findIndex(x => x.iD === eValue.id);

    // find the Calendar event index
    let calIndexToDelete = this.events.findIndex(x => x.id === eValue.id);

    //delete appointent from database
    this.appointmentService.deleteAppointment(this.appointments[appIndexToDelete])

    //remove appointment from appointment list
    this.appointments.splice(appIndexToDelete, 1);

    // remove calendar event from events list
    this.events.splice(calIndexToDelete, 1);

  }

  startUpdateAppointment(event: any)
  {
    //extract calendar event from emmitted event
    let eValue = event.value;

    //find appointment based on calendar event
    let appIndex = this.appointments.findIndex(x => x.iD === eValue.id);
    let appointmentToUpdate: Appointment = this.appointments[appIndex]

    //Set fields of current object form
    this.stylistid =  appointmentToUpdate.stylistID;
    this.name = appointmentToUpdate.name;
    this.email = appointmentToUpdate.email;
    this.phone = appointmentToUpdate.phone;
    this.date = appointmentToUpdate.date;
    this.dateCreated = appointmentToUpdate.dateCreated;
    this.description = appointmentToUpdate.description; 

    //show update form
    this.updatingAppointment = true;


  }

  setCreateAppointment()
  {
    
  }

}
