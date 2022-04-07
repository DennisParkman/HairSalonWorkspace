import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { endOfDay } from 'date-fns';
import { forkJoin, Observable } from 'rxjs';
import { Stylist } from 'src/app/models/stylist.model';
import { StylistHours, WeekDay } from 'src/app/models/stylisthours.model';
import { Unavailability } from 'src/app/models/unavailability.model';

@Injectable(
{
  providedIn: 'root'
})
export class StylistScheduleService 
{

  constructor(private http: HttpClient) 
  { }
  //backend baseURL
  readonly baseURL = 'http://localhost:63235/';

  /**
     * 
     */
   getStylistSchedule(showUnavailabilities: boolean = false): Observable<CalendarEvent[][]>
   {
        let unavailabilityUrl = this.baseURL.concat("Unavailability");
        let stylistHoursUrl = this.baseURL.concat("StylistHours");
        let stylistsUrl = this.baseURL.concat("Stylist");

        return new Observable(observer => {
            forkJoin(
            {
                unavailabilities: this.http.get<Unavailability[]>(unavailabilityUrl),
                hours: this.http.get<StylistHours[]>(stylistHoursUrl),
                stylists: this.http.get<Stylist[]>(stylistsUrl)
            }).subscribe(({unavailabilities, hours, stylists}) => 
            {
                let allEvents : CalendarEvent[][] = [];
                // Assuming we're only adding weekly schedules, with single timeframes

                //Get each list of unavailabilities sorted by stylist id
                let stylistUnavailabilities:Unavailability[][] = []

                //Get each list of hours sorted by stylist id
                let stylistHours:StylistHours[][] = []


                for(let stylist of stylists)
                {
                  if(stylist.id == null)
                    continue;

                  stylistUnavailabilities[stylist.id] = [];
                  stylistHours[stylist.id] = [];
                  allEvents[stylist.id] = [];
                }

                for(let unavailability of unavailabilities)
                {
                  unavailability.startDate = new Date(unavailability.startDate);
                  unavailability.endDate = new Date(unavailability.endDate);
                  stylistUnavailabilities[unavailability.stylistID].push(unavailability);
                }

                for(let hour of hours)
                {
                  stylistHours[hour.stylistID].push(hour);
                }

                for(let stylist of stylists)
                {
                  let stylistId = stylist.id;
                  if(stylistId == null)
                    continue;

                  let hours = stylistHours[stylistId];
                  if(hours == null || hours.length == 0)
                    continue;
                  
                  let events = allEvents[stylistId];

                  let unavailabilities = stylistUnavailabilities[stylistId]

                  let sunday = hours.find(x => x.day == WeekDay.Sunday);
                  let monday = hours.find(x => x.day == WeekDay.Monday);
                  let tuesday = hours.find(x => x.day == WeekDay.Tuesday);
                  let wednesday = hours.find(x => x.day == WeekDay.Wednesday);
                  let thursday = hours.find(x => x.day == WeekDay.Thursday);
                  let friday = hours.find(x => x.day == WeekDay.Friday);
                  let saturday = hours.find(x => x.day == WeekDay.Saturday);

                  let days = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
                  
                  let today = new Date();
                  // Get's day 0 to 6 (sunday to saturday)
                  let day = today.getDay();

                  for(let i=0; i<365; i++)
                  {
                    let currentDay = days[day%7];
                    if(currentDay != null)
                    {
                      //Add day, i represents how many days away from today
                      // Assuming schedule hours are XX:XX
                      let startHours = currentDay.startTime.split(':')[0];
                      let startMinutes = currentDay.startTime.split(':')[1]
                      let endHours = currentDay.endTime.split(':')[0]
                      let endMinutes = currentDay.endTime.split(':')[1]

                      let startDay = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
                      startDay.setHours(parseInt(startHours));
                      startDay.setMinutes(parseInt(startMinutes));

                      let endDay = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
                      endDay.setHours(parseInt(endHours));
                      endDay.setMinutes(parseInt(endMinutes));

                      events.push(
                        {
                          id: stylistId,
                          start: startDay,
                          end: endDay,
                          title: ''
                        }
                      )
                    }
                    day++;
                  }

                  //remove unavailabilities
                  for(let unavailability of unavailabilities)
                  {
                    if(showUnavailabilities)
                    {
                      events.push(
                        {
                          id: unavailability.id,
                          start: unavailability.startDate,
                          end: unavailability.endDate,
                          title: "Unavailable"
                        }
                      )
                    }
                    

                    for(let i=0; i<events.length; i++)
                    {
                      let event = events[i];
                      if(event.end == null)
                      {
                        continue;
                      }

                      // Check if unavailability starts in event
                      if(unavailability.startDate.getTime() > event.start.getTime() && unavailability.startDate.getTime() < event.end.getTime())
                      {
                        //unavailability start date falls within event
                        if(unavailability.endDate.getTime() < event.end.getTime())
                        {
                          //Unavailability falls entirely within event

                          //Make new event for segmented second part
                          let newEvent : CalendarEvent = {
                            id: stylistId,
                            start: unavailability.endDate,
                            end: event.end,
                            title: ""
                          }
                          //Add new event
                          events.push(newEvent);

                          //Update event end time
                          event.end = unavailability.startDate;

                        }
                        else
                        {
                          //Unavailability starts in middle of event, but ends after
                          //Cut off event end early
                          event.end = unavailability.startDate;
                        }
                      }
                      // Check if event end falls inside of unavailability
                      else if(unavailability.endDate.getTime() > event.start.getTime() && unavailability.endDate.getTime() < event.end.getTime())
                      {
                        //unavailability end date falls within event
                        event.start = unavailability.endDate;
                      }
                      // Check if unavailablity encompasses event
                      else if (unavailability.startDate.getTime() <= event.start.getTime() && event.end.getTime() <= unavailability.endDate.getTime())
                      {
                        events.splice(i, 1);
                        i--;
                      } 

                    }


                  
                  }
                }

                observer.next(allEvents);

                observer.complete();
            });
        })
   }
   
}
