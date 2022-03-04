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
  datecreated: Date;
  description: string;

  addingAppointment: boolean = false;
  loadingFinished: boolean = false;

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
              id:appointment.id,
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
    this.datecreated = new Date;
    this.description = "";
  }

  addAppointment()
  {
    let appointment = {stylistId: this.stylistid, name: this.name, email: this.email, phone: this.phone, date: this.date, dateCreated: this.datecreated, description: this.description};
    this.appointmentService.addAppointment(appointment).subscribe(value => 
    {
      this.appointments.push(value);
      this.addingAppointment = false;
      this.clearFields();
    });
  }

}
