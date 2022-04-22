/*
  redirects to homepage if no path specified
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentPageComponent } from './components/appointment-page/appointment-page.component';

import { HomePageComponent } from './components/home-page/home-page.component';
import { StylistPageComponent } from './components/stylist-page/stylist-page.component';
import { SchedulePageComponent } from './components/schedule-page/schedule-page.component';
import { UnavailabilityPageComponent } from './components/unavailability-page/unavailability-page.component';
import { ManagerGuard } from './guards/manager.guard';
import { StylistGuard } from './guards/stylist.guard';
import { ReceptionistGuard } from './guards/receptionist.guard';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { UsersPageComponent } from './components/users-page/users-page.component';

//list of url endings and associated components
const routes: Routes = 
[
  {path: 'home', component: HomePageComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'stylists', component: StylistPageComponent, canActivate: [StylistGuard]},
  {path: 'schedule', component: SchedulePageComponent, canActivate: [ManagerGuard]},
  {path: 'appointments', component: AppointmentPageComponent, canActivate: [ReceptionistGuard]},
  {path: 'unavailabilities', component: UnavailabilityPageComponent, canActivate: [ManagerGuard]},
  {path: 'loginpage', component: LoginPageComponent},
  {path: 'users', component: UsersPageComponent, canActivate: [ManagerGuard]}
];

@NgModule(
{
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule 
{ }
