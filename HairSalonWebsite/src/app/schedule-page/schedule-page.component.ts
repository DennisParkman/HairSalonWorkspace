import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent} from 'angular-calendar';
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
  selectedSylistList: Stylist[] = []; //list of all stylist selected by user
  
  eventsToShow: CalendarEvent[] = []; //calendar events list of unavailabilities and appointments
  allEvents: CalendarEvent[]= []; //all calendar events for the schedule page

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
        //call service methods to fetch all unavaiblites, appointments, and stylists
        appointments: this.appointmentService.getAppointment(), 
        unavailabilities: this.unavailabilityService.getUnavailabilities(),
        stylists: this.stylistService.getStylists()
      }).subscribe(({appointments, unavailabilities, stylists}) => {
        this.appointmentList = appointments; //set appointments to appointment list
        console.log(this.appointmentList);

        this.unavailabilitiesList = unavailabilities; //set unavailabilities to unavailabilities list
        console.log(this.unavailabilitiesList);

        this.stylistList = stylists; //set unavailabilities to unavailabilities list
        console.log(this.stylistList);
        
        //add appointments to calendar event list
        for(let appointment of this.appointmentList)
        {
          this.allEvents.push(
            {
              start: new Date(appointment.date),
              title: appointment.name + " - " + appointment.description
            }
          );
        }

        //add unavailabilities to calendar events list
        for(let unavailability of this.unavailabilitiesList)
        {
          this.allEvents.push(
            {
              start: new Date(unavailability.startDate),
              end: new Date(unavailability.endDate),
              title: unavailability.stylistName + " time off"
            }
          );
        }
        this.eventsToShow = this.allEvents; //load events to show on calendar
        console.log(this.eventsToShow);
        this.scheduleLoading = false; //show calendar
      }
    );
  }

  /**
   * Function to maintain all stylists selected on the front end drop down menu and call the showScheduleBy
   * function to update the calendar. The function checks to see if the stylist passed as a parameter is currently
   * on the list. If they are not on the list, this indicates that the user selected them for viewing and they are
   * appended to the list. If they are currently on the list, then that idicates that the user deselected them, and 
   * they are removed from the list.
   * @param stylist : stylist to be added or subtracted from the list of stylist selected
   */
  changeStylistSelected(stylist: Stylist)
  {
    let index = this.selectedSylistList.indexOf(stylist); //get index of stylist on selected list of stylists
    if(index != -1) //if they are already on list, remove
    {
      this.selectedSylistList.splice(index,1);
    }
    else //else, add the stylist to the list
    {
      this.selectedSylistList.push(stylist);
    }
    console.log(this.selectedSylistList);
    this.showScheduleBy(); //update the events being shown on the calendar
  }

  /**
   * Function to show only calendar events of stylists selected by the user. Defaults to 
   * showing all stylists if no stylists are selected
   * @param stylist : the stylist to update the calendar events list by
   */
  showScheduleBy()
  {
    //check stylist selected to see if it is empty or not
    if(this.selectedSylistList.length == 0) //if list is empty, show all events
    {
      this.eventsToShow = this.allEvents;
    }
    else //show all events of selected stylists
    {
      this.eventsToShow = []; //create local list of events for one stylist

      //iterate through selectedStylistsList to display all events associated with them
      for(let stylist of this.selectedSylistList)
      {
        //get unavaiblites and appointments for the requested stylist
        for(let appointment of this.appointmentList) //check for appointments
        {
          if(appointment.stylistID == stylist.id) //load appoinment if stylistID is equal to requested stylist
          {
            //create appointment and push it onto the event list
            this.eventsToShow.push(
              {
                start: new Date(appointment.date),
                title: appointment.name + " - " + appointment.description
              }
            );
          }  
        }
        for(let unavailability of this.unavailabilitiesList) //check for unavailabilities
        {
          if(unavailability.stylistID == stylist.id) //load unavailability if stylistID is equal to requested stylist
          {
            //create unavailability and push it onto the event list
            this.eventsToShow.push(
              {
                start: new Date(unavailability.startDate),
                end: new Date(unavailability.endDate),
                title: unavailability.stylistName + " time off"
              }
            );
          }
        }
      }
      console.log(this.eventsToShow);
    }
  }
}
