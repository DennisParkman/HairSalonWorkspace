import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { CalendarEvent } from 'angular-calendar';
import { AppointmentService } from '../services/appointment-service/appointment.service';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';
import { MatDialog } from '@angular/material/dialog';
import { Stylist } from '../models/stylist.model';
import { FormControl } from '@angular/forms';
import { forkJoin, Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { StylistService } from '../services/stylist-service/stylist.service';


@Component(
{
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.scss']
})
export class AppointmentPageComponent implements OnInit
{
  //Decorator to mark appCalendar as a ViewChild which allows for information to passed between components
  @ViewChild(EventCalendarComponent) appCalendar!: EventCalendarComponent
  @ViewChild('addDialog', {static: true}) addDialog: TemplateRef<any>; //tag used for the add and update forms

  //appointment attributes for forms
  id: number;
  stylistid: number;
  name: string;
  email: string;
  phone: string;
  date: Date;
  dateCreated: Date;
  description: string;

  //form control for dropdown
  stylistIDControl = new FormControl();
  //filter observable for dropdown
  filteredStylists: Observable<Stylist[]>;

  //booleans to display and hide forms on the appointments page
  loadingFinished: boolean = false; // boolean for displaying page
  appointmentLoading: boolean = true; // boolean to show appointments are being loaded from the backend
  addingAppointment: boolean = false;
  updatingAppointment: boolean = false;
  
  events: CalendarEvent[] = []; //array to populate all appointments on the calendar
  appointments: Appointment[]; //array of appointments serviced from the backend 
  stylists: Stylist[]; //an array of stylists used to get id-name pairs from the stylists for the dropdown menu

  constructor(private appointmentService: AppointmentService, private stylistService: StylistService, private dialog: MatDialog) { }

  /**
   * On loading page, all appointments on the database are loaded in and put into the event calendar array
   * and the appointments array
   */
  ngOnInit(): void 
  {
    //forkjoin call to stylists and appointments database tables so they happen correctly
    forkJoin(
      {
        //call service to load all appointments from the database
        appointments: this.appointmentService.getAppointment(),
        //call service to load all stylists from the database
        stylists: this.stylistService.getStylists()
      }).subscribe(({appointments, stylists}) => 
      {
        this.appointments = appointments; //set appointments to appointment list
        console.log(this.appointments);

        this.stylists = stylists; //save the stylist list
        console.log(this.stylists);
        
        //add appointments to calendar event list
        for(let appointment of this.appointments)
        {
          this.events.push(
            {
              id:appointment.id,
              start: new Date(appointment.date),
              title: appointment.name + " - " + appointment.description
            }
          );
        }

        //set up the dropdown filter
        this.filteredStylists = this.stylistIDControl.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.stylistName)),
          map(name => (name ? this.stylistDropdownFilter(name) : this.stylists.slice()))
        )

        // display the page and show that appointments are done loading
        this.loadingFinished = true; 
        this.appointmentLoading = false;
      });
  }

  /**
   * helper function for ngOnInit to filter the stylist list by an entered stylist name
   */
  private stylistDropdownFilter(name: string): Stylist[]
  {
    const filterValue = name.toLowerCase();

    return this.stylists.filter(stylist => stylist.name.toLowerCase().includes(filterValue));
  }

  /**
   * event method that sets the form stylistid field
   * @param event the event that was fired
   */
  setStylistIdFromDropdown(event: any)
  {
    this.stylistid = event.value.id;
  }

  /** 
   * @param stylist the stylist whose name should be displayed
   * @returns the name of the stylist
   */
  stylistDropdownDisplay(stylist: Stylist): string
  {
    if(stylist != null && stylist.name != null && stylist.name != '')
    {
      return stylist.name;
    }
    else
    {
      return '';
    }
  }


  /**
   * Function to hide the the add appoinment field
   */
  cancelAddAppointment()
  {
    this.addingAppointment = false; //changes form boolean
    this.clearFields(); // clears all appointment fields
    this.dialog.closeAll(); //closes dialog boxes
  }

  /**
   * function to clear form fields
   */
  clearFields()
  {
    this.stylistid = 0;
    this.stylistIDControl.reset(); //clear the dropdown value
    this.name = "";
    this.email = "";
    this.phone = "";
    this.date = new Date;
    this.dateCreated = new Date;
    this.description = "";
  }

  /**
   * function to add a new appointment to the database and front end lists
   */
  addAppointment()
  {
    //convert form dates to date objects
    this.dateCreated = new Date();
    this.date = new Date(this.date);

    //create appointment variable to store form fields
    let appointment = 
    {
      stylistID: this.stylistid, 
      name: this.name, 
      email: this.email, 
      phone: this.phone, 
      date: this.date, 
      dateCreated: this.dateCreated, 
      description: this.description
    };

    //call appointment service to add appointment to database
    this.appointmentService.addAppointment(appointment).subscribe(value => 
    {
      this.addingAppointment = false; //hide add appointment form

      //create calendar event to add to event list
      let event : CalendarEvent = 
      {
        id: value.id, 
        start: this.date, 
        title: this.name + " - " + this.description
      };
      this.clearFields(); //clear form fields
      this.appointments.push(value); //push appointment to appointment list

      //call calendar event component function to reload event list with new item
      this.appCalendar.updateCalendarEvent(event);
      this.dialog.closeAll(); //close dialog box
    });
  }

  /**
   * Function to delete an appointment from the database and from the front end lists
   * @param event : event to be deleted
   */
  deleteAppointment(event: any)
  {
    //reload page
    this.appCalendar.deleteCalendarEvent(event)

    //find appointment based on calendar event
    let appIndexToDelete = this.appointments.findIndex(x => x.id === event.id);

    //delete appointent from database
    this.appointmentService.deleteAppointment(this.appointments[appIndexToDelete])

    //remove appointment from appointment list
    this.appointments.splice(appIndexToDelete, 1);
  }

  /**
   * Function to show update appoinment form and set all form fields
   * @param event : object to be updated
   */
  startUpdateAppointment(event: any)
  {

    //find appointment based on calendar event
    let appIndex = this.appointments.findIndex(x => x.id === event.id);
    let appointmentToUpdate: Appointment = this.appointments[appIndex]

    //set fields of current object form
    this.id = event.id;
    this.stylistid =  appointmentToUpdate.stylistID;
    this.stylistIDControl.setValue(this.stylists.find(stylist => stylist.id == this.stylistid)); //autopopulate the dropdown with the stylist
    this.name = appointmentToUpdate.name;
    this.email = appointmentToUpdate.email;
    this.phone = appointmentToUpdate.phone;
    this.date = appointmentToUpdate.date;
    this.dateCreated = appointmentToUpdate.dateCreated;
    this.description = appointmentToUpdate.description; 

    //show update form
    this.updatingAppointment = true;
    this.dialog.open(this.addDialog);
  }

  /**
   * Function to update database with changed appointment information and update front end list 
   * with new information
   */
  updateAppointment()
  {
    //convert this.date to date object
    this.date = new Date(this.date);

    //package fields into an appointment object
    let appointment = 
    {
      id: this.id, 
      stylistID: this.stylistid, 
      name: this.name, 
      email: this.email, 
      phone: this.phone, 
      date: this.date, 
      dateCreated: this.dateCreated, 
      description: this.description
    };

    //create a calendar event from appointment object
    let event = 
    {
      id:this.id, 
      start: this.date, 
      title: this.name + " - " + this.description
    };

    //call service to update appointment in database
    this.appointmentService.updateAppointment(appointment);
    
    //find index of appoinment to change and replace existing information in appoinment list
    let appIndexToUpdate = this.appointments.findIndex(x => x.id === appointment.id);
    this.appointments[appIndexToUpdate] = appointment;

    //clear fields and set booleans
    this.updatingAppointment = false;
    this.clearFields();
    
    //reload calendar view and close dialog box
    this.appCalendar.updateCalendarEvent(event);
    this.dialog.closeAll();
  }

  /**
   * function to close update form and clear all form fields
   */
  cancelUpdateAppointment()
  {
    this.updatingAppointment = false;
    this.clearFields();
    this.dialog.closeAll();
  }

  /**
   * function to show create form from dialog box of events
   */
  setCreateAppointment()
  {
    this.addingAppointment = true;
    this.dialog.open(this.addDialog);
  }

}
