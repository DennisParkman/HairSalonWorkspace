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
  appointments: Appointment[] = [{stylistId: 1, name: "test", email: "email.com", phone: "00555", date: new Date, dateCreated: new Date, description: "help"}];
  stylistid: number;
  name: string;
  email: string;
  phone: string;
  date: Date;
  datecreated: Date;
  description: string;

  addingAppointment: boolean = false;
  loadingFinished: boolean = false;

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void 
  {
    this.appointmentService.getAppointment().subscribe(s => {this.appointments = s; this.loadingFinished = true; console.log(this.appointments)});
  }
  /*
    toggles add appointment 
  */
  showAddAppointment()
  {
    this.addingAppointment = true;
    console.log("show");
  }

  /*
    
  */
  cancelAddAppointment()
  {
    this.clearFields();
    this.addingAppointment = false;
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
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  setView(view: CalendarView) 
  {
    this.view = view;
  }
  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      title: 'First event',
    },
    {
      start: startOfDay(new Date()),
      title: 'Second event',
    }
  ]
  
  for(appointment: Appointment ,of: Appointment ,appointments: Appointment)
  {
    this.events = [
      ...this.events,
      {
        start: appointment['date'],
        title: appointment['name']+appointment['description']
      }
    ]
  }
  
 
  
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void 
  {
    console.log(date);
    //let x=this.adminService.dateFormat(date)
    //this.openAppointmentList(x)
  }

}
