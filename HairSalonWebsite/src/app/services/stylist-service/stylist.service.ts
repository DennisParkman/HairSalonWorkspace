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

    addStylist(stylist: Stylist): void
    {
        let url = this.baseURL.concat("Stylist");
        console.log("Post");
        this.http.post(url, stylist).subscribe();
    }
}