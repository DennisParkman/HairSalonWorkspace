import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Stylist } from "../../models/stylist.model";
import { Observable } from "rxjs";

@Injectable(
{
    providedIn: 'root'
})
export class StylistService 
{

    constructor(private http: HttpClient) 
    { }
    //backend baseURL
    readonly baseURL = 'http://localhost:63235/';
    /**
     * To add a stylist object to the C# backend database located at 
     * @baseURL variable in the form of an enumrable array
     * @param stylist is the object that is added
     * @returns stylist that is added
     */
    addStylist(stylist: Stylist): Observable<Stylist>
    {
        let url = this.baseURL.concat("Stylist");
        return this.http.post<Stylist>(url, stylist);
    }
    
    /**To get an enumerable array of stylists from the C# backend database located at 
     * @baseURL variable in the form of an enumrable array
     * @returns returns all the stylists as an enumerbale array 
     */
    getStylists(): Observable<Stylist[]>
    {
        let url = this.baseURL.concat("Stylist");
        return this.http.get<Stylist[]>(url); // <Stylist> is required on this line when a constructor is included in the model file
    }

     /**
     * To update a stylist object to the C# backend database located at 
     * @baseURL variable in the form of an enumrable array
     * @param stylist is the object that contains updated information for a stylist entry in the database
     */
    updateStylist(stylist: Stylist): void
    {
        let url = this.baseURL.concat("Stylist");
        this.http.put(url, stylist).subscribe();
    }

    /**
     * To delete a stylist object from the C# backend database located 
     * @baseURL variable in the form of an enumrable array
     * @param stylist is the object that needs to be deleted
     */
    deleteStylist(stylist: Stylist): void
    {
        let url = this.baseURL.concat("Stylist/" + stylist.id);
        this.http.delete(url).subscribe();
    }
}