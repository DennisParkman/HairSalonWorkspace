import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Unavailability } from "../../models/unavailability.model";
import { Observable } from "rxjs";
import { Stylist } from "src/app/models/stylist.model";

@Injectable(
{
    providedIn: 'root'
})
export class UnavailabilityService 
{

    constructor(private http: HttpClient) 
    { }

    readonly baseURL = 'http://localhost:63235/';
    
    addUnavailability(unavailability: Unavailability): Observable<Unavailability>
    {
        let url = this.baseURL.concat("Unavailability");
        return this.http.post<Unavailability>(url, unavailability);
    }
    
    /**
     * @returns a response from the C# backend database located at @baseURL variable in the form of an enumrable array
     */
    getUnavailabilities(): Observable<Unavailability[]>
    {
        let url = this.baseURL.concat("Unavailability");
        return this.http.get<Unavailability[]>(url); // <unavailability> is required on this line when a constructor is included in the model file
    }

     /**
     * To update a unavailability object to the C# backend database located at @baseURL variable in the form of an enumrable array
     * @param unavailability is the object that contains updated information for a unavailability entry in the database
     */
    updateUnavailability(unavailability: Unavailability): void
    {
        let url = this.baseURL.concat("Unavailability");
        this.http.put(url, unavailability).subscribe();
    }

    /**
     * To delete a unavailability object from the C# backend database located @baseURL variable in the form of an enumrable array
     */
    deleteUnavailability(unavailability: Unavailability): void
    {
        let url = this.baseURL.concat("Unavailability/" + unavailability.id);
        this.http.delete(url).subscribe();
    }
    
    /**
     * @returns a response from the C# backend database located at @baseURL variable in the form of an enumrable array
     */
    getUnavailabilitiesByStylist(stylist: Stylist): Observable<Unavailability[]>
    {
        let url = this.baseURL.concat("Unavailability/" + stylist.id);
        console.log(url)
        return this.http.get<Unavailability[]>(url); // <unavailability> is required on this line when a constructor is included in the model file
    }
}