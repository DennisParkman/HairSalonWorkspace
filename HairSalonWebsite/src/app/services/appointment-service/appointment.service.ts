import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable(
{
  providedIn: 'root'
})
export class AppointmentService 
{

  constructor(private http: HttpClient) 
  { }

  readonly baseURL = 'http://localhost:63235/';

  
}
