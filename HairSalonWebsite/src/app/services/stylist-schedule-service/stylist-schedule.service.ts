import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { endOfDay } from 'date-fns';
import { forkJoin, Observable } from 'rxjs';
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
   getStylistSchedule(stylisthours: StylistHours): Observable<CalendarEvent[]>
   {
        let unavailabilityUrl = this.baseURL.concat("Unavailability");
        let stylistHoursUrl = this.baseURL.concat("StylistHours");

        return new Observable(observer => {
            forkJoin(
            {
                unavailabilities: this.http.get<Unavailability[]>(unavailabilityUrl),
                hours: this.http.get<StylistHours[]>(stylistHoursUrl)
            }).subscribe(({unavailabilities, hours}) => 
            {
                let events : CalendarEvent[] = [];
                // Assuming we're only adding weekly schedules, with single timeframes

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
                        start: startDay,
                        end: endDay,
                        title: ''
                      }
                    )
                  }
                  day++;
                }


                for(let hour of hours)
                {
                  //

                  events.push(
                    {
                      start: new Date(hour.startTime),
                      end: new Date(hour.endTime),
                      title: ""
                    }
                  );
                }

                //remove unavailabilities
                for(let unavailability of unavailabilities)
                {

                  

                  for(let i=0; i<events.length; i++)
                  {
                    let event = events[i];
                    if(event.end == null)
                    {
                      continue;
                    }

                    // Check if unavailability starts in event
                    if(unavailability.startDate > event.start && unavailability.startDate < event.end)
                    {
                      //unavailability start date falls within event
                      if(unavailability.endDate < event.end)
                      {
                        //Unavailability falls entirely within event

                        //Make new event for segmented second part
                        let newEvent = {
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
                    else if(unavailability.endDate > event.start && unavailability.endDate < event.end)
                    {
                      //unavailability end date falls within event
                      event.start = unavailability.endDate;
                    }
                    // Check if unavailablity encompasses event
                    else if (unavailability.startDate <= event.start && unavailability.endDate <= event.start)
                    {
                      events.splice(i, 1);
                      i--;
                    } 

                  }


                  
                }

                observer.next(events);

                observer.complete();
            });
        })
   }
   
}
