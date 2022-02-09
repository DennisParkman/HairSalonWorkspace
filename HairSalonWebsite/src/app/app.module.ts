import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WeatherService } from './services/weather.service';
import { StylistService } from './services/stylist-service/stylist.service';

@NgModule(
{
  declarations: 
  [
    AppComponent,
    HomePageComponent
  ],
  imports: 
  [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [StylistService],
  bootstrap: [AppComponent]
})
export class AppModule 
{ }
