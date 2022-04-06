import { Component, OnInit } from '@angular/core';
import { User,UserRole } from '../models/user.model';

@Component(
{
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit 
{
  //user roles to restrict access to certain pages
  managerRole: UserRole = UserRole.Manager;
  stylistRole: UserRole = UserRole.Stylist;
  receptionistRole: UserRole = UserRole.Receptionist;
  dummy: User = {id: 1, username: "Dummy", password: "pass123", role: UserRole.Manager};
  
  constructor() { }

  ngOnInit(): void {}

  /**
   * Function to allow access to certain features on the navbar
   */
   canAccess(accessLevel: UserRole)
   {
     
     return this.dummy.role == accessLevel;
   }
}
