import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Stylist } from "../../models/stylist.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StylistService {

    constructor(private http: HttpClient) { }

    readonly baseURL = 'http://localhost:63235/';

}