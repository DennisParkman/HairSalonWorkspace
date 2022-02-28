import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Unavailability } from "../../models/unavailability.model";
import { Observable } from "rxjs";

@Injectable(
{
    providedIn: 'root'
})
export class unavailabilityService 
{

    constructor(private http: HttpClient) 
    { }

    readonly baseURL = 'http://localhost:63235/';
    
    addunavailability(unavailability: Unavailability): Observable<Unavailability>
    {
        let url = this.baseURL.concat("Unavailability");
        return this.http.post<Unavailability>(url, unavailability);
    }
    
    /**
     * @returns a response from the C# backend database located at @baseURL variable in the form of an enumrable array
     */
    getunavailabilitys(): Observable<Unavailability[]>
    {
        let url = this.baseURL.concat("Unavailability");
        return this.http.get<Unavailability[]>(url); // <unavailability> is required on this line when a constructor is included in the model file
    }

     /**
     * To update a unavailability object to the C# backend database located at @baseURL variable in the form of an enumrable array
     * @param unavailability is the object that contains updated information for a unavailability entry in the database
     */
    updateunavailability(unavailability: Unavailability): void
    {
        let url = this.baseURL.concat("Unavailability");
        this.http.put(url, unavailability).subscribe();
    }

    /**
     * To delete a unavailability object from the C# backend database located @baseURL variable in the form of an enumrable array
     */
    deleteunavailability(unavailability: Unavailability): void
    {
        let url = this.baseURL.concat("Unavailability/" + unavailability.id);
        this.http.delete(url).subscribe();
    }
}