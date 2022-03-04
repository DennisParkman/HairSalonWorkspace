/*
  redirects to homepage if no path specified
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { StylistPageComponent } from './stylist-page/stylist-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';

//list of url endings and associated components
const routes: Routes = 
[
  {path: 'home', component: HomePageComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'stylists', component: StylistPageComponent},
  {path: 'schedule', component: SchedulePageComponent}
];

@NgModule(
{
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule 
{ }
