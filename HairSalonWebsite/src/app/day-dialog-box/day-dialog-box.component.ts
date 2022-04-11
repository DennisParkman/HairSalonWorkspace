import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CalendarEvent } from "angular-calendar";

// Object used to take calendar events and a boolean on whether or not to show delete / update / create buttons as input
export class DialogDataObject {
  events: CalendarEvent[]
  crudFeatures: boolean
  crudCondition: string;
}

@Component({
  selector: 'app-day-dialog-box',
  templateUrl: 'day-dialog-box.component.html',
})
export class DayDialogBoxComponent {
  
  // Output emitters used to trigger a method call in a component that holds this one
  @Output() deleteEvent = new EventEmitter<CalendarEvent>();
  @Output() createEvent = new EventEmitter();
  @Output() updateEvent = new EventEmitter<CalendarEvent>();

  // Constructer call takes dialog data object to load calendar events and whether crud features should be shown
  constructor(public dialogRef: MatDialogRef<DayDialogBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogDataObject) {}

  // When close button is hit, close dialog
  onClose(): void 
  {
    this.dialogRef.close();
  }
  
  // Emit delete event to parent component when delete button is hit
  deleteEventHandler(event: CalendarEvent) 
  {
    this.deleteEvent.emit(event);
  }

  // Emit create event to parent component when create button is hit
  createEventHandler() 
  {
    this.createEvent.emit();
    this.dialogRef.close();
  }

  // Emit update event to parent component when update button is hit
  updateEventHandler(event: CalendarEvent) 
  {
    this.updateEvent.emit(event);
    this.dialogRef.close();
  }

}