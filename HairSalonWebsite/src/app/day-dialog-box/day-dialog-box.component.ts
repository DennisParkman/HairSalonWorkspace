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
  
  @Output() deleteEvent = new EventEmitter<string>();
  @Output() createEvent = new EventEmitter<string>();
  @Output() updateEvent = new EventEmitter<string>();

  constructor(public dialogRef: MatDialogRef<DayDialogBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogDataObject) {}

  onClose(): void {
    this.dialogRef.close();
  }
  
  deleteEventHandler() {
    this.deleteEvent.emit("");
  }

  createEventHandler() {
    this.createEvent.emit("");
  }

  updateEventHandler() {
    this.updateEvent.emit("");
  }

}