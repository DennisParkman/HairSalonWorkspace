import { Component, OnInit } from '@angular/core';
import { User,UserRole } from '../models/user.model';
import { SessionStorageService } from 'ngx-webstorage';

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
  username: string;
  userData: any;

  constructor(private sessionStorage: SessionStorageService) {}

  ngOnInit(): void 
  {
    if(this.sessionStorage.retrieve('user') != null)
    {
      this.userData = this.sessionStorage.retrieve('user');
      this.username = this.userData.username;
    }
    
  }

  /**
   * Function to allow access to certain features on the navbar
   */
   canAccess(accessLevel: UserRole)
   {
     if(this.sessionStorage.retrieve('user') == null)
     {
       return false;
     }
     return this.sessionStorage.retrieve('user').role == accessLevel;
   }

   /**
   * Function to check if a user has been set
   * returns true if the user is set by the login page
   */
   isLoggedIn()
   {
    if(this.sessionStorage.retrieve('user') != null)
    {
      this.userData = this.sessionStorage.retrieve('user');
      this.username = this.userData.username;
    }
    return this.sessionStorage.retrieve('user') != null;
   }

   /**
   * Function to clear the user set in the session storage object
   * by the login page
   */
   logout()
   {
      this.sessionStorage.clear('user');
   }
}
