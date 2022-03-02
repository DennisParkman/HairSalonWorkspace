import { Component, OnInit } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.scss']
})
export class AppointmentPageComponent implements OnInit 
{
  appointments: Appointment[] = [{stylistid: 1, name: "test", email: "email.com", phone: "00555", date: new Date, datecreated: new Date, description: "help"}];
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
    this.appointmentService.getAppointments().subscribe(s => {this.appointments = s; this.loadingFinished = true; console.log(this.appointments)});
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
  cancelAddAppoinment()
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

  }


}
