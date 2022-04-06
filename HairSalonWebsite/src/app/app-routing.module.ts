/*
  redirects to homepage if no path specified
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentPageComponent } from './appointment-page/appointment-page.component';

import { HomePageComponent } from './home-page/home-page.component';
import { StylistPageComponent } from './stylist-page/stylist-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { UnavailabilityPageComponent } from './unavailability-page/unavailability-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { UsersPageComponent } from './users-page/users-page.component';

//list of url endings and associated components
const routes: Routes = 
[
  {path: 'home', component: HomePageComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'stylists', component: StylistPageComponent},
  {path: 'schedule', component: SchedulePageComponent},
  {path: 'appointments', component: AppointmentPageComponent},
  {path: 'unavailabilities', component: UnavailabilityPageComponent},
  {path: 'loginpage', component: LoginPageComponent}
  {path: 'users', component: UsersPageComponent}
];

@NgModule(
{
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule 
{ }
