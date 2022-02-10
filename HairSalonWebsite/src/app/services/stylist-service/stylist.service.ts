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
     * To add a stylist object to the C# backend database located at @baseURL variable in the form of an enumrable array
     * @param stylist is the object that is added
     */
    addStylist(stylist: Stylist): void
    {
        let url = this.baseURL.concat("Stylist");
        this.http.post(url, stylist).subscribe();
    }
}