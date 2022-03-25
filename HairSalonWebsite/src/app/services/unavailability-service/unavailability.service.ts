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
    //backend baseURL
    readonly baseURL = 'http://localhost:63235/';
    
    /**
     * To add new unavailability to the backend database controller located at 
     * @baseURL variable in the form of an enumrable array
     * @param unavailability is the object to be sent to the backend
     * @returns unavailability that is added
     */
    addUnavailability(unavailability: Unavailability): Observable<Unavailability>
    {
        let url = this.baseURL.concat("Unavailability");
        return this.http.post<Unavailability>(url, unavailability);
    }
    
    /**
     * To get an enumerble array of unavailabiltities from the C# backend database located at 
     * @baseURL variable in the form of an enumrable array
     * @returns all unavailabiltites as an enumerable array
     */
    getUnavailabilities(): Observable<Unavailability[]>
    {
        let url = this.baseURL.concat("Unavailability");
        return this.http.get<Unavailability[]>(url); // <unavailability> is required on this line when a constructor is included in the model file
    }

     /**
     * To update a unavailability object to the C# backend database located at 
     * @baseURL variable in the form of an enumrable array
     * @param unavailability is the object that contains updated information for a unavailability entry in the database
     */
    updateUnavailability(unavailability: Unavailability): void
    {
        console.log(unavailability); //debug
        let url = this.baseURL.concat("Unavailability");
        this.http.put(url, unavailability).subscribe();
    }

    /**
     * To delete a unavailability object from the C# backend database located 
     * @baseURL variable in the form of an enumrable array
     * @param unavailability is the object that needs to be deleted
     */
    deleteUnavailability(unavailability: Unavailability): void
    {
        let url = this.baseURL.concat("Unavailability/" + unavailability.id);
        this.http.delete(url).subscribe();
    }
    
    /**
     * A method to get an array of unavailabilties for a specific stylist from the C# backend database located at 
     * @baseURL variable in the form of an enumrable array
     * @param stylist is the object whose unavailabilities are returned
     * @returns all unavailabilities for the specified stylist as an enumerable array  
     */
    getUnavailabilitiesByStylist(stylist: Stylist): Observable<Unavailability[]>
    {
        let url = this.baseURL.concat("Unavailability/" + stylist.id);
        console.log(url)
        return this.http.get<Unavailability[]>(url); // <unavailability> is required on this line when a constructor is included in the model file
    }
}