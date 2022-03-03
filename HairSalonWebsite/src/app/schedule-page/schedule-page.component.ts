import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent} from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { Unavailability } from '../models/unavailability.model';
import { Appointment } from '../models/appointment.model';
import { Stylist } from '../models/stylist.model';
import { UnavailabilityService } from '../services/unavailability-service/unavailability.service';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { StylistService } from '../services/stylist-service/stylist.service';


@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit 
{
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  startOfDay: CalendarEvent;

  unavailabilitiesList: Unavailability[]
  appointmentList: Appointment[];
  stylistList: Stylist[];

  events: CalendarEvent[] = 
  [
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
    }
  ]

  constructor(private stylistService: StylistService, private unavailabilityService: UnavailabilityService, private appointmentService: AppointmentService ) { }

  ngOnInit(): void 
  {

    /*this.unavailabilityService.getUnavailabilities().subscribe(s => 
      {
        this.unavailabilitiesList = s; 
        console.log(this.unavailabilitiesList)
      }
    );

    this.appointmentService.getAppointment().subscribe(s => 
      {
        this.appointmentList = s; 
        console.log(this.appointmentList)
      }
    );*/
  }

  setView(view: CalendarView) 
  {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void 
  {
    console.log(date);
    //this.openAppointmentList(date)
  }

  

}
