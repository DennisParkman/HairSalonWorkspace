import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { StylistService } from '../services/stylist-service/stylist.service';
import { Stylist } from '../models/stylist.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit 
{

  constructor(private weatherService: WeatherService,
              private stylistService: StylistService) { }
  

  ngOnInit(): void 
  { }

  get() 
  {
    this.weatherService.getWeather().subscribe(value => console.log(value));
  }

  add()
  {
    //replced weather with stylist
    /**this.weatherService.addWeather
    (
      {
        date: new Date()
      }
    );**/

    this.stylistService.addStylist
    (
      {
        name: "hello",
        id: 0,
        level: 0,
        bio: "bio"

      }
    );
    
  }

}
