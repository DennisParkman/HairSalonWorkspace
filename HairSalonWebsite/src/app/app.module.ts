import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StylistService } from './services/stylist-service/stylist.service';
import { FooterComponent } from './components/footer/footer.component';
import { StylistPageComponent } from './components/stylist-page/stylist-page.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulePageComponent } from './components/schedule-page/schedule-page.component';
import { AppointmentPageComponent } from './components/appointment-page/appointment-page.component';
import { AppointmentService } from './services/appointment-service/appointment.service';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DayDialogBoxComponent } from './components/day-dialog-box/day-dialog-box.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { UnavailabilityPageComponent } from './components/unavailability-page/unavailability-page.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { ToastrModule } from 'ngx-toastr';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule(
{
  declarations: 
  [
    AppComponent,
    HomePageComponent,
    FooterComponent,
    NavbarComponent,
    StylistPageComponent,
    SchedulePageComponent,
    DayDialogBoxComponent,
    AppointmentPageComponent,
    EventCalendarComponent,
    UnavailabilityPageComponent,
    UsersPageComponent,
    LoginPageComponent
  ],
  imports: 
  [
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    CommonModule,
    RouterModule,
    NgxMatTimepickerModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    ToastrModule.forRoot(),
    FlexLayoutModule,
    NgxWebstorageModule.forRoot(),
    
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  providers: [StylistService, AppointmentService],
  bootstrap: [AppComponent]
})
export class AppModule 
{ }
