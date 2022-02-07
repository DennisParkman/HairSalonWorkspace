import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit 
{

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void 
  { }

  get() 
  {
    this.weatherService.getWeather().subscribe(value => console.log(value));
  }

  add() 
  {
    this.weatherService.addWeather
    (
      {
        date: new Date()
      }
    );
  }

}