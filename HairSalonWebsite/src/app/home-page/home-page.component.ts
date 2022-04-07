import { Component, OnInit } from '@angular/core';
import { StylistScheduleService } from '../services/stylist-schedule-service/stylist-schedule.service';

@Component(
{
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit 
{

  constructor(private stylistScheduleService: StylistScheduleService) 
  { }

  ngOnInit(): void 
  { 
    this.stylistScheduleService.getStylistSchedule().subscribe(a =>
      {
        console.log(a);
      }

      );

  }

}
