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

@NgModule(
{
  declarations: 
  [
    AppComponent,
    HomePageComponent,
    FooterComponent,
    NavbarComponent
  
  ],
  imports: 
  [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [StylistService],
  bootstrap: [AppComponent]
})
export class AppModule 
{ }
