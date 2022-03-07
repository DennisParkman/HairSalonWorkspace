import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { MatDialog } from '@angular/material/dialog';
import { DayDialogBoxComponent } from '../day-dialog-box/day-dialog-box.component';
import { Subject } from 'rxjs';
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
  refresh: Subject<any> = new Subject();
  
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

  public updateCalendarEvent(event: CalendarEvent) {
    if(this.calEvents.findIndex(x => x.id == event.id) > -1)
    {
      this.calEvents.splice(this.calEvents.findIndex(x => x.id == event.id), 1);
    }
    this.calEvents.push(event);
    this.refresh.next("");
  }

  public deleteCalendarEvent(event: CalendarEvent) {
    this.calEvents.splice(this.calEvents.findIndex(x => x.id == event.id), 1);
    this.refresh.next("");
  }
  
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void 
  {
    this.dayOfEvents = events;

    let dialogRef = this.dialog.open(DayDialogBoxComponent, 
      {
        width:'1000px', 
        data:
        {
          events: this.dayOfEvents, 
          crudFeatures:this.supportCRUD
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
      this.createEvent.emit();
    });
  }

}
