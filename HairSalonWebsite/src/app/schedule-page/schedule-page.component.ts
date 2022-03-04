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
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  startOfDay: CalendarEvent;

  unavailabilitiesList: Unavailability[]
  appointmentList: Appointment[];
  stylistList: Stylist[];
  dayOfEvents: CalendarEvent[] = [];

  events: CalendarEvent[] = [];

  scheduleLoading: boolean = true;

  constructor(private stylistService: StylistService, 
    private unavailabilityService: UnavailabilityService, 
    private appointmentService: AppointmentService,
    public dialog: MatDialog ) { }

  ngOnInit(): void 
  {

    forkJoin(
      {
        appointments: this.appointmentService.getAppointment(), 
        unavailabilities: this.unavailabilityService.getUnavailabilities()
      }).subscribe(({appointments, unavailabilities}) => {
        this.appointmentList = appointments; 
        console.log(this.appointmentList);

        this.unavailabilitiesList = unavailabilities; 
        console.log(this.unavailabilitiesList);
        
        for(let appointment of this.appointmentList)
        {
          this.events.push(
            {
              start: new Date(appointment.date),
              title: appointment.name + " - " + appointment.description
            }
          );
        }

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
        this.scheduleLoading = false;

      }
    );
  }

  setView(view: CalendarView) 
  {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void 
  {
    console.log(date);
    //this.openAppointmentList(date)
    this.dayOfEvents = events;

    this.dialog.open(DayDialogBoxComponent, 
      {
        width:'1000px', 
        data:
        {
          events: this.dayOfEvents, 
          crudFeatures:false
        }
      }
    );
  }
}
