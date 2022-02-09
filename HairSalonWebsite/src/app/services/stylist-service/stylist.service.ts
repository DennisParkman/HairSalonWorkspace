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

    getStylists(): Observable<Stylist>
    {
        let url = this.baseURL.concat("Stylist");
        console.log("Got stylists");
        return this.http.get<Stylist>(url); // <Stylist> is required on this line when a constructor is included in the model file
    }
}