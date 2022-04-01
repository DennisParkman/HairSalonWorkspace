import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StylistHours } from 'src/app/models/stylisthours.model';

@Injectable(
{
  providedIn: 'root'
})
export class StylisthoursService 
{

  constructor(private http: HttpClient) 
  { }
  //backend baseURL
  readonly baseURL = 'http://localhost:63235/';

  /**
     * To add a stylisthours object to the C# backend database located at 
     * @baseURL variable in the form of an enumrable array
     * @param stylisthours is the object that is added
     * @returns stylisthour that is added
     */
   addStylistHours(stylisthours: StylistHours): Observable<StylistHours>
   {
       let url = this.baseURL.concat("StylistHours");
       console.log(url);
       console.log(stylisthours);
       return this.http.post<StylistHours>(url, stylisthours);
   }
   
   /**
    * To get an enumerable array of stylisthours from the C# backend database located at
    * @baseURL variable in the form of an enumrable array
    * @returns all stylisthours as an enumerable array
    */
   getStylistHours(): Observable<StylistHours[]>
   {
       let url = this.baseURL.concat("StylistHours");
       return this.http.get<StylistHours[]>(url); // <StylistHours> is required on this line when a constructor is included in the model file
   }

    /**
    * To update a object to the C# backend database located at 
    * @baseURL variable in the form of an enumrable array
    * @param stylisthours is the object that contains updated information for a stylisthours entry in the database
    */
   updateStylistHours(stylisthours: StylistHours): void
   {
       let url = this.baseURL.concat("StylistHours");
       this.http.put(url, stylisthours).subscribe();
   }

   /**
    * To delete a stylisthours object from the C# backend database located 
    * @baseURL variable in the form of an enumerable array
    * @param stylisthours is the object that needs to be deleted
    */
   deleteStylistHours(stylisthours: StylistHours): void
   {
       let url = this.baseURL.concat("StylistHours/" + stylisthours.id);
       this.http.delete(url).subscribe();
   }

}
