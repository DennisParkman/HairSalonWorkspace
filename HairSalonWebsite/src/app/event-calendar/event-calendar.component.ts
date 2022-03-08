import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent } from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { DayDialogBoxComponent } from '../day-dialog-box/day-dialog-box.component';
import { Subject } from 'rxjs';
@Component(
{
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit
{

  // Variables that are taken as input from parent component
  @Input() calEvents: CalendarEvent[] = []; //the list of CalendarEvents to display in the calendar
  @Input() supportCRUD: boolean = false;
  
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  dayOfEvents: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  
  // Event emitters used to output events when events are sent to this component from day-dialog-box
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

  // Update calender event list when event is updated / created
  public updateCalendarEvent(event: CalendarEvent) 
  {
    if(this.calEvents.findIndex(x => x.id == event.id) > 0)
    {
      this.calEvents.splice(this.calEvents.findIndex(x => x.id == event.id), 1);
    }
    this.calEvents.push(event);
    this.refresh.next("");
  }

  // Update calender event list when event is deleted
  public deleteCalendarEvent(event: CalendarEvent) 
  {
    this.calEvents.splice(this.calEvents.findIndex(x => x.id == event.id), 1);
    this.refresh.next("");
  }

  // Open dialog when day of calendar is clicked
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

    // Emit delete event when delete event is sent from dialog
    dialogRef.componentInstance.deleteEvent.subscribe(event => {
      this.deleteEvent.emit(event);
    });

    // Emit update event when update event is sent from dialog
    dialogRef.componentInstance.updateEvent.subscribe(event => {
      this.updateEvent.emit(event);
    });

    // Emit create event when create event is sent from dialog
    dialogRef.componentInstance.createEvent.subscribe(() => {
      this.createEvent.emit();
    });
  }

}
