import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WeatherService } from './services/weather.service';
import { NavbarComponent } from './navbar/navbar.component';
import { StylistService } from './services/stylist-service/stylist.service';

@NgModule(
{
  declarations: 
  [
    AppComponent,
    HomePageComponent,
    NavbarComponent
  
  ],
  imports: 
  [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule 
{ }
