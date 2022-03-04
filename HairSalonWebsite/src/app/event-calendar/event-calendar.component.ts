import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { MatDialog } from '@angular/material/dialog';
import { DayDialogBoxComponent } from '../day-dialog-box/day-dialog-box.component';
@Component({

  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit
{

  @Input() calEvents: CalendarEvent[] = []; //the list of CalendarEvents to display in the calendar
  @Input() supportCRUD: boolean = false;
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  dayOfEvents: CalendarEvent[] = [];
  
  @Output() deleteEvent = new EventEmitter<CalendarEvent>();
  @Output() createEvent = new EventEmitter();
  @Output() updateEvent = new EventEmitter<CalendarEvent>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void 
  {
    this.setView(this.view);
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

    let dialogRef = this.dialog.open(DayDialogBoxComponent, 
      {
        width:'1000px', 
        data:
        {
          events: this.dayOfEvents, 
          crudFeatures:false
        }
      }
    );

    dialogRef.componentInstance.deleteEvent.subscribe(event => {
      this.deleteEvent.emit(event);
    });

    dialogRef.componentInstance.updateEvent.subscribe(event => {
      this.updateEvent.emit(event);
    });

    dialogRef.componentInstance.createEvent.subscribe(() => {
      this.deleteEvent.emit();
    });
  }

}
