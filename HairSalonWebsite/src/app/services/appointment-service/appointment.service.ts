import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from 'src/app/models/appointment.model';
import { Stylist } from 'src/app/models/stylist.model';

@Injectable(
{
  providedIn: 'root'
})
export class AppointmentService 
{

  constructor(private http: HttpClient) 
  { }

  readonly baseURL = 'http://localhost:63235/';

  /**
     * To add an appointment object to the C# backend database located at @baseURL variable in the form of an enumrable array
     * @param appointment is the object that is added
     */
   addAppointment(appointment: Appointment): Observable<Appointment>
   {
       let url = this.baseURL.concat("Appointment");
       console.log(url);
       console.log(appointment);
       return this.http.post<Appointment>(url, appointment);
       
   }
   
   /**
    * @returns a response from the C# backend database located at @baseURL variable in the form of an enumrable array
    */
   getAppointment(): Observable<Appointment[]>
   {
       let url = this.baseURL.concat("Appointment");
       return this.http.get<Appointment[]>(url); // <Appointment> is required on this line when a constructor is included in the model file
   }

    /**
    * To update an appointment object to the C# backend database located at @baseURL variable in the form of an enumrable array
    * @param appointment is the object that contains updated information for a appointment entry in the database
    */
   updateAppointment(appointment: Appointment): void
   {
       let url = this.baseURL.concat("Appointment");
       this.http.put(url, appointment).subscribe();
   }

   /**
    * To delete an appointment object from the C# backend database located @baseURL variable in the form of an enumrable array
    */
   deleteAppointment(appointment: Appointment): void
   {
       let url = this.baseURL.concat("Appointment/" + appointment.iD);
       this.http.delete(url).subscribe();
   }

   /**
    * A method to select an appointment for a specific stylist
    */
   getAppointmentByStylist(stylist: Stylist): Observable<Appointment[]>
   {
      let url = this.baseURL.concat("Stylist/" + stylist.id)
      return this.http.get<Appointment[]>(url); 
   }
}

