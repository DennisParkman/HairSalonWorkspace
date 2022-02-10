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

    readonly baseURL = 'http://localhost:63235/';
    /**
     * @author James Pangia and Jake Morris
     * @returns a response from the C# backend database located at @baseURL variable in the form of an enumrable array
     */
    getStylists(): Observable<Stylist[]>
    {
        let url = this.baseURL.concat("Stylist");
        return this.http.get<Stylist[]>(url); // <Stylist> is required on this line when a constructor is included in the model file
    }
}