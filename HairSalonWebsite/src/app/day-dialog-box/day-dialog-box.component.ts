import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CalendarEvent } from "angular-calendar";

export class DialogDataObject {
  events: CalendarEvent[]
  crudFeatures: boolean
}

@Component({
  selector: 'app-day-dialog-box',
  templateUrl: 'day-dialog-box.component.html',
})
export class DayDialogBoxComponent {
  
  @Output() deleteEvent = new EventEmitter<CalendarEvent>();
  @Output() createEvent = new EventEmitter();
  @Output() updateEvent = new EventEmitter<CalendarEvent>();

  constructor(public dialogRef: MatDialogRef<DayDialogBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogDataObject) {}

  onClose(): void {
    this.dialogRef.close();
  }
  
  deleteEventHandler(event: CalendarEvent) {
    this.deleteEvent.emit(event);
  }

  createEventHandler() {
    this.createEvent.emit();
    this.dialogRef.close();
  }

  updateEventHandler(event: CalendarEvent) {
    this.updateEvent.emit(event);
    this.dialogRef.close();
  }

}