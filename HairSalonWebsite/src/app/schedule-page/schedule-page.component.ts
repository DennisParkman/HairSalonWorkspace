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
import { forkJoin } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DayDialogBoxComponent } from '../day-dialog-box/day-dialog-box.component';


@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit 
{
  //attributes to change and update calendar view
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  startOfDay: CalendarEvent;

  //lists that will be used to populate the event calendar list
  unavailabilitiesList: Unavailability[]
  appointmentList: Appointment[];
  stylistList: Stylist[];
  dayOfEvents: CalendarEvent[] = [];
  
  events: CalendarEvent[] = []; //calendar events list of unavailabilities and appointments

  scheduleLoading: boolean = true; //boolean to load page

  constructor(private stylistService: StylistService, 
    private unavailabilityService: UnavailabilityService, 
    private appointmentService: AppointmentService,
    public dialog: MatDialog ) { }

    /**
   * On loading page, all unavailabilities and appointments on the database are loaded in and put into the event calendar array
   * and their corresponding object arrays.
   */
  ngOnInit(): void 
  {

    forkJoin(
      {
        //call service methods to fetch all unavaiblites and appointments
        appointments: this.appointmentService.getAppointment(), 
        unavailabilities: this.unavailabilityService.getUnavailabilities()
      }).subscribe(({appointments, unavailabilities}) => 
      {
        this.appointmentList = appointments; //set appointments to appointment list
        console.log(this.appointmentList);

        this.unavailabilitiesList = unavailabilities; //set unavailabilities to unavailabilities list
        console.log(this.unavailabilitiesList);
        
        //add appointments to calendar event list
        for(let appointment of this.appointmentList)
        {
          this.events.push(
            {
              start: new Date(appointment.date),
              title: appointment.name + " - " + appointment.description
            }
          );
        }

        //add unavailabilities to calendar events list
        for(let unavailability of this.unavailabilitiesList)
        {
          this.events.push(
            {
              start: new Date(unavailability.startDate),
              end: new Date(unavailability.endDate),
              title: unavailability.stylistName + " time off"
            }
          );
        }

        console.log(this.events);
        this.scheduleLoading = false; //show calendar

      }
    );
  }
}
