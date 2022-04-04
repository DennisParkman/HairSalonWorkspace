import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { forkJoin, Observable } from 'rxjs';
import { StylistHours } from 'src/app/models/stylisthours.model';
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
                let events = [];
                for(let hour of hours)
                {
                  events.push(
                    {
                      id:hour.id,
                      start: new Date(hour.startTime),
                      end: new Date(hour.endTime),
                      title: hour.day + ""
                    }
                  );
                }

                observer.complete();
            });
        })
   }
   
}
