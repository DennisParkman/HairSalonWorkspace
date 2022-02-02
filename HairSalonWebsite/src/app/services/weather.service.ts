import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { WeatherForecast } from "../models/weather-forecast.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    constructor(private http: HttpClient) { }

    readonly baseURL = 'http://localhost:63235/';
    
    addWeather(weatherForecast: WeatherForecast): void {
        let url = this.baseURL.concat("WeatherForecast");
        this.http.post(this.baseURL, weatherForecast);
    }
    
    getWeather(): Observable<WeatherForecast> {
        let url = this.baseURL.concat("WeatherForecast");
        return this.http.get(this.baseURL);
    }
}