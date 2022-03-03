import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { StylistService } from './services/stylist-service/stylist.service';
import { FooterComponent } from './footer/footer.component';
import { StylistPageComponent } from './stylist-page/stylist-page.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { AppointmentService } from './services/appointment-service/appointment.service';

@NgModule(
{
  declarations: 
  [
    AppComponent,
    HomePageComponent,
    FooterComponent,
    NavbarComponent,
    StylistPageComponent,
    SchedulePageComponent
  
  ],
  imports: 
  [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    CommonModule,
    RouterModule
  ],
  providers: [StylistService, AppointmentService],
  bootstrap: [AppComponent]
})
export class AppModule 
{ }
